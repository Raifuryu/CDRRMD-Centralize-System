import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import { compare } from "bcryptjs";

const credentialsConfig = CredentialsProvider({
  name: "Credentials",
  credentials: {
    username: {
      label: "User Name",
    },
    password: {
      label: "Password",
      type: "password",
    },
  },
  async authorize(credentials) {
    if (!credentials?.username || !credentials.password) {
      return null;
    }
    const user = await prisma.account.findFirst({
      where: {
        username: credentials.username || "",
      },
      include: {
        person: true,
        PersonAccountRole: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    // @ts-ignore
    const isPasswordMatch = compare(credentials.password, user?.password);

    if (!isPasswordMatch) {
      return null;
    }
    console.log(user.person.firstName + " " + user.person.lastName);
    return {
      name: user.person.firstName + " " + user.person.lastName,
    };
  },
});

const config = {
  providers: [credentialsConfig],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
function PrismaAdapter(
  prisma: any
): import("@auth/core/adapters").Adapter | undefined {
  throw new Error("Function not implemented.");
}
