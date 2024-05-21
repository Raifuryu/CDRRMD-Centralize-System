import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import prisma from "@/lib/prisma";

const getData = async () => {
  const data = await prisma.person.findMany({
    where: {
      PersonCategory: {
        some: {
          category: "Personnel",
        },
      },
    },
  });

  return Response.json(data).json();
};

export default async function Page() {
  const personnel = await getData();

  return (
    <main>
      <div className="flex items-center justify-center">
        <div className="container mt-10">
          <DataTable columns={columns} data={personnel} />
        </div>
      </div>
    </main>
  );
}
