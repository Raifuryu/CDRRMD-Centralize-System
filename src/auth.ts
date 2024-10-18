import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import { compare } from "bcryptjs";

export const BASE_PATH = "/api/auth";

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
        person: {
          include: {
            office: true,
          },
        },
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
    return {
      id: user.personId.toString(),
      name: user.person.firstName + " " + user.person.lastName,
      officeId: user.person.officeId.toString(),
      officeName: user.person.office.name,
      officeAcronym: user.person.office.acronym,
    };
  },
});

const config = {
  providers: [credentialsConfig],
  callbacks: {
    async jwt({ token, user }) {
      // If user exists (after successful authentication), add the user ID to the token
      if (user) {
        token.id = user.id;
        token.officeId = user.officeId;
        token.officeName = user.officeName;
        token.officeAcronym = user.officeAcronym;
      }
      return token;
    },

    async session({ session, token, user }) {
      session.user.id = token.id as string;
      session.user.officeId = token.officeId as string;
      session.user.officeName = token.officeName as string;
      session.user.officeAcronym = token.officeAcronym as string;
      console.log(session);
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
function PrismaAdapter(
  prisma: any
): import("@auth/core/adapters").Adapter | undefined {
  throw new Error("Function not implemented.");
}
