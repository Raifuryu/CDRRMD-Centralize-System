import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";

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
    const oneDay = 24 * 60 * 60 * 1000;
    // Email is used as the ID
    // counldn't find a way to add another attribute in user
    return {
      email: user.personId.toString(),
      name: user.person.firstName + " " + user.person.lastName,
    };
  },
});

const config = {
  providers: [credentialsConfig],
  callbacks: {
    async session({ session, token, user }) {
      const data = await prisma.account.findFirst({
        where: {
          id: parseInt(user.email),
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
      console.log(data);
      session.officeName = data?.person.office.name || "Office";
      session.officeAcronym = data?.person.office.acronym || "Office";
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
