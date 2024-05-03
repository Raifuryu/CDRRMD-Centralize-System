import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "./schemas/definitions";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
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
              PersonAccountRole: {
                include: {
                  role: true,
                },
              },
            },
          });

          if (!user || !user.password) return;

          const passwordMatch = await bcrypt.compare(password, user.password);
          console.log(user);
          if (passwordMatch) return user as any;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
