import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import type { NextApiRequest } from "next";

export async function getUserFromRequest(req: NextApiRequest) {
  try {
    // 1️⃣ Try to get session token from next-auth (cookie based)
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("🔐 Session from next-auth:", session);

    if (session) {
      return {
        email: session.email ?? null,
        // NextAuth's default JWT structure puts user info differently, so we check multiple places:
        role:
          (session as any).user?.role || // if you add role in user object
          (session as any).role ||       // or directly on token
          "user",
        id:
          (session as any).user?.id ||  // if you put id inside user
          (session as any).sub ||        // 'sub' is the default subject (user id) claim
          null,
      };
    }

    // 2️⃣ Fallback: Check for Bearer token in Authorization header
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
