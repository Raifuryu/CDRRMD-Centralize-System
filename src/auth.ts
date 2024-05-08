import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 10 },
  secret: process.env.AUTH_SECRET || "any random string",
  callbacks: {
    async session({ session, token }) {
      session.sessionToken = token as any;
      return session;
    },
  },
});
