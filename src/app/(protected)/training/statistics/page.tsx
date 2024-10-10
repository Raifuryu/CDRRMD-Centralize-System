import React from "react";
import { Statistics } from "./statistics";
import prisma from "@/lib/prisma";

const getCourseData = async () => {
  const data = await prisma.course.findMany({});
  return Response.json(data).json();
};

const getTrainingData = async () => {
  const data = await prisma.training.findMany({});
  return data;
};

export default async function AnalysisPage() {
  const courseData = await getCourseData();
  const trainingData = await getTrainingData();
  return (
    <div>
      <Statistics courseData={courseData} trainingRawData={trainingData} />
    </div>
  );
}
