import React from "react";
import Form from "./add-form";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const getBarangayData = async () => {
  const data = await prisma.barangay.findMany({});
  const transformedData = data.map((e) => ({
    value: e.id.toString(),
    label: e.name,
  }));

  return transformedData;
};

const getOfficeData = async () => {
  const data = await prisma.office.findMany({});
  console.log("Check");

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
      TrainingHost: {
        include: {
          trainer: {
            select: {
              name: true,
            },
          },
        },
      },
      TrainingDocuments: {
        select: {
          afterActivityReport: true,
          documentation: true,
        },
      },
      requestingOffice: true,
    },
  });
  return Response.json(data).json();
};

export default async function Page() {
  const officeId = cookies().get("office")?.value.toString() || "2";
  const courseData = await getCourseData();
  const trainingData = await getTrainingData();
  const officeData = await getOfficeData();

  return (
    <main className="m-10">
      <h6 className="mt-5 ml-10">Training - Information Management System</h6>
      <div className="flex items-center justify-center border rounded-2xl shadow-md bg-gray-100">
        <div className="m-5">
          <DataTable columns={columns} data={trainingData} />
        </div>
      </div>
      <Form
        courseData={courseData}
        officeData={officeData}
        officeId={officeId}
      />
      {/* {JSON.stringify(session)} */}
    </main>
  );
}
