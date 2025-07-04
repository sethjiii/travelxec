import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import type { NextApiRequest } from "next";

export async function getUserFromRequest(req: NextApiRequest) {
  try {
    // 1️⃣ Try next-auth session token
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("🔐 Session from next-auth:", session);

    if (session) {
      return {
        email: session.email ?? null,
        role: (session as any).user?.role || (session as any).role || "user",
        id: (session as any).user?.id || (session as any).sub || null,
      };
    }

    // 2️⃣ Fallback: Custom JWT in Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("🔐 No Authorization header or not Bearer format");
      return null;
    }

    const token = authHeader.split(" ")[1];
    console.log("🔐 JWT token from header:", token);

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log("✅ Decoded JWT:", decoded);
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        console.error("❌ JWT expired at:", error.expiredAt);
      } else {
        console.error("❌ JWT verification error:", error.message);
      }
      return null;
    }

    return {
      email: decoded.email ?? null,
      role: decoded.role || "user",
      id: decoded.userId || decoded._id || null,
    };
  } catch (err) {
    console.error("❌ Unexpected error in getUserFromRequest:", err);
    return null;
  }
}
