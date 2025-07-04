import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      role?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.email = user.email;

        const dbConnect = (await import("@/pages/api/dbConnect")).default;
        const User = (await import("@/models/user")).default;
        await dbConnect();

        let dbUser = await User.findOne({ email: user.email });
        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            profilePicture: user.image,
            password: "", // For OAuth
            role: "user",
          });

          // ✅ Send welcome email if new
          const { sendWelcomeEmail } = await import("@/lib/mail");
          await sendWelcomeEmail(user.email!, user.name || "Traveler");
        }

        token.role = dbUser.role;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
      session.user.id = typeof token.id === "string" ? token.id : undefined;
      session.user.role = typeof token.role === "string" ? token.role : "user";
      return session;
    },

    async redirect({ url, baseUrl }) {
      return `${baseUrl}/`;
    },
  },
});
