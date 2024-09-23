import React from "react";
import { Statistics } from "./statistics";
import prisma from "@/lib/prisma";

const getCourseData = async () => {
  const data = await prisma.course.findMany({});
  return Response.json(data).json();
};

export default async function AnalysisPage() {
  const courseData = await getCourseData();

  return (
    <div>
      <Statistics courseData={courseData} />
    </div>
  );
}
