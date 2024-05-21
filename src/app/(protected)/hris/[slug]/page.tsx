import React from "react";
import { Dashboard } from "./dashboard";
import prisma from "@/lib/prisma";

const getPersonnelTrainingData = async (id: string) => {
  const data = await prisma.personnelTraining.findMany({
    where: {
      id: parseInt(id),
    },
  });

  return Response.json(data).json();
};

export default async function Page({ params }: { params: { slug: number } }) {
  const personnelTraining = await getPersonnelTrainingData(
    params.slug.toString()
  );
  return (
    <main>
      <Dashboard
        personnelId={params.slug}
        personnelTraining={personnelTraining}
      />
    </main>
  );
}
