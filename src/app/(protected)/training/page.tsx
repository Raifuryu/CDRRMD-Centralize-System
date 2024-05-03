import React from "react";
import { auth } from "@/auth";
import Form from "./add-form";

export default async function Page() {
  const session = await auth();

  return (
    <main>
      <Form />
      {JSON.stringify(session)}
    </main>
  );
}
