import React from "react";

import prisma from "@/lib/prisma";
import { SignupForm } from "./register-form";

const getPersons = async () => {
  const data = await prisma.person.findMany({
    select: {
      id: true,
      firstName: true,
      middleName: true,
      lastName: true,
      extensionName: true,
    },
  });
  return Response.json(data).json();
};

export default async function Page() {
  const persons = await getPersons();

  return (
    <main>
      <SignupForm persons={persons} />
    </main>
  );
}
