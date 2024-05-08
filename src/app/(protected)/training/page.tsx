import React from "react";
import { auth } from "@/auth";
import Form from "./add-form";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import prisma from "@/lib/prisma";

const getOfficeData = async () => {
  const data = await prisma.office.findMany({});

  return Response.json(data).json();
};

const getCourseData = async () => {
  const data = await prisma.course.findMany({});
  return Response.json(data).json();
};

const getTrainingData = async () => {
  const data = await prisma.training.findMany({
    include: {
      TrainingCourse: {
        include: {
          course: true,
        },
      },
      TrainingOffice: {
        include: {
          office: true,
        },
      },
    },
  });
  return Response.json(data).json();
};

export default async function Page() {
  const session = await auth();
  const courseData = await getCourseData();
  const trainingData = await getTrainingData();
  const officeData = await getOfficeData();

  return (
    <main>
      <div className="flex items-center justify-center">
        <div className="container mt-10">
          <DataTable columns={columns} data={trainingData} />
        </div>
      </div>
      <Form courseData={courseData} officeData={officeData} />
      {/* {JSON.stringify(session)} */}
    </main>
  );
}
