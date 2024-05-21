"use client";

import LearningAndDevelopmentSheet from "./learning-and-development-sheet";
import { PersonnelTrainingSchema } from "@/schemas/personnelDefinitions";
import { z } from "zod";

type personnelTraining = z.infer<typeof PersonnelTrainingSchema>;

export default function LearningAndDevelopment({
  personnelId,
  personnelTraining,
}: {
  personnelId: number;
  personnelTraining: personnelTraining[];
}) {
  return (
    <div>
      <div className="container border rounded-2xl">
        {personnelTraining.map((e) => {
          return e.name;
        })}
      </div>
      <LearningAndDevelopmentSheet personnelId={personnelId} />
    </div>
  );
}
