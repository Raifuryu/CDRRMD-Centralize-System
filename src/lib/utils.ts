import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// salt and hash password
export async function saltAndHashPassword(password: any) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}
