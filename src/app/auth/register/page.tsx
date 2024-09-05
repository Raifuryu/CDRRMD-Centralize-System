import React from "react";
import { SignupForm } from "./register-form";
import prisma from "@/lib/prisma";

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
