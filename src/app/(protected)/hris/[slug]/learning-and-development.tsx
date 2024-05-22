"use client";

import { Button } from "@/components/ui/button";
import LearningAndDevelopmentSheet from "./learning-and-development-sheet";
import { PersonnelTrainingSchema } from "@/schemas/personnelDefinitions";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { z } from "zod";
import Link from "next/link";

type personnelTraining = z.infer<typeof PersonnelTrainingSchema>;

const getPersonnelName = async (id: Number) => {
  const res = await fetch(`/api/hris/learning-and-development/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  return Response.json(data[0]).json();
};

export default function LearningAndDevelopment({
  personnelId,
  personnelTraining,
}: {
  personnelId: number;
  personnelTraining: personnelTraining[];
}) {
  const personnelData = getPersonnelName(personnelId);

  return (
    <div>
      {personnelTraining.map((e, index) => {
        return (
          <div className="container border rounded-2xl m-3" key={index}>
            <div className="flex space-x-5 m-3">
              {index + 1 + ". "}
              <div className="border rounded-md">Training Name:{e.name}</div>
              <div className="border rounded-md">Training Host:{e.host}</div>
              <div className="border rounded-md">
                Certification Date:
                {format(e.dateOfTraining.split("T")[0], "PPP")}
              </div>
              <div className="border rounded-md">
                Training Hours:{e.trainingHours}
              </div>
              <div className="border rounded-md">
                <Link
                  href={`/uploads/training/${personnelData.firstName}/2024-05-22_asd.pdf`}
                  target="_blank"
                >
                  <FileText />
                </Link>
              </div>
              <div className="border rounded-md">
                Certificate Status:{e.certificateStatus}
              </div>
            </div>
          </div>
        );
      })}

      <LearningAndDevelopmentSheet personnelId={personnelId} />
    </div>
  );
}
