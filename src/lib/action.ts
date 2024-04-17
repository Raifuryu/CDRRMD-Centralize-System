"use server";

import { revalidateTag } from "next/cache";

export async function revalidatePerson() {
  revalidateTag("person");
}
