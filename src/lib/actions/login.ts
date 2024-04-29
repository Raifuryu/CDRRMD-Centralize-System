"use server"

import { signIn } from "@/auth";

export const login = async (value: any) => {
  await signIn("credentials", value);
};
