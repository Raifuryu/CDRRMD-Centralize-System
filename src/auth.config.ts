"use server";

import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "./schemas/definitions";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export default {
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { username, password } = validatedFields.data;

          const user = await prisma.account.findFirst({
            where: {
              username: username,
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

          if (!user || !user.password) return;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            const oneDay = 24 * 60 * 60 * 1000;
            cookies().set("office", user.person.officeId.toString(), {
              path: "/",
              sameSite: "none",
              secure: true,
            });
            return user as any;
          }
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
