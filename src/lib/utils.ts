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

export const getIp = async (): Promise<string> => {
  try {
    const res = await fetch("http://ipecho.net/plain", {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }

    return await res.text();
  } catch (error) {
    console.error("Error fetching public IP:", error);
    return ""; // Return empty string on error
  }
};
