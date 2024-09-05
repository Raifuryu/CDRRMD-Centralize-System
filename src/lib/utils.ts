import { cache } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// salt and hash password
export async function saltAndHashPassword(password: any) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}
