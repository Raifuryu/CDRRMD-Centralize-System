import React from "react";
import { auth } from "@/auth";
import Form from "./add-form";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import prisma from "@/lib/prisma";

const getCourseData = async () => {
  const data = await prisma.course.findMany({});

  return Response.json(data).json();
};

export default async function Page() {
  const session = await auth();
  const courseData = await getCourseData();

  return (
    <main>
      <div className="flex items-center justify-center">
        <div className="container mt-10">
          <DataTable columns={columns} data={[]} />
        </div>
      </div>
      <Form courseData={courseData} />
      {JSON.stringify(session)}
    </main>
  );
}
