import React from "react";
import CardNavigator from "./CardNavigator";
import { auth } from "@/auth";
import { cardData, categories } from "@/lib/links";
import { getIp } from "@/lib/utils";

export default async function Page() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-4 md:px-24 justify-center w-full">
      <CardNavigator
        categories={categories}
        cardData={cardData}
        externalIp={await getIp()}
        accountModules={session?.user.accountModules || []}
      />
    </main>
  );
}
