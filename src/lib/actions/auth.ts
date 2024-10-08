"use server";
import bcrypt from "bcryptjs";
import * as z from "zod";
import prisma from "@/lib/prisma";
import { RegisterFormSchema } from "@/schemas/definitions";
import { signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const login = async (value: any) => {
  await signIn("credentials", value, {
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  });
};

export const logout = async () => {
  await signOut({ redirectTo: "/login" });
};

export const register = async (values: z.infer<typeof RegisterFormSchema>) => {
  const validatedFields = RegisterFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { personId, username, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.account.findFirst({
    where: {
      username: username,
    },
  });

  if (existingUser) {
    return { error: "Username already taken!" };
  }

  await prisma.account.create({
    data: {
      personId: personId,
      username: username,
      password: hashedPassword,
    },
  });

  return { success: "Registered!" };
};
