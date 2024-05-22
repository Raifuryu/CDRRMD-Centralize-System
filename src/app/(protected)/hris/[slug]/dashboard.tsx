"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import PersonalInformation from "./personal-information";
import FamilyBackground from "./family-background";
import EducationalBackground from "./educational-background";
import CivilServiceEligibility from "./civil-service-eligibility";
import WorkExperience from "./work-experience";
import VoluntaryWork from "./voluntary-work";
import LearningAndDevelopment from "./learning-and-development";
import OtherInformation from "./other-information";
import { PersonnelTrainingSchema } from "@/schemas/personnelDefinitions";
import { z } from "zod";

type personnelTraining = z.infer<typeof PersonnelTrainingSchema>;

export function Dashboard({
  personnelId,
  personnelTraining,
}: {
  personnelId: number;
  personnelTraining: personnelTraining[];
}) {
  const [category, setCategory] = useState(1);

  const renderCategoryComponent = () => {
    switch (category) {
      case 1:
        return <PersonalInformation personnelId={personnelId} />;
      case 2:
        return <FamilyBackground />;
      case 3:
        return <EducationalBackground />;
      case 4:
        return <CivilServiceEligibility />;
      case 5:
        return <WorkExperience />;
      case 6:
        return <VoluntaryWork />;
      case 7:
        return (
          <LearningAndDevelopment
            personnelId={personnelId}
            personnelTraining={personnelTraining}
          />
        );
      case 8:
        return <OtherInformation />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <div className="border rounded-2xl mt-5 p-5 space-x-5">
          <Button onClick={() => setCategory(1)}>Personal Information</Button>
          <Button onClick={() => setCategory(2)}>Family Background</Button>
          <Button onClick={() => setCategory(3)}>Educational Background</Button>
          <Button onClick={() => setCategory(4)}>
            Civil Service Eligibility
          </Button>
          <Button onClick={() => setCategory(5)}>Work Experience</Button>
          <Button onClick={() => setCategory(6)}>Voluntary Work</Button>
          <Button onClick={() => setCategory(7)}>
            Learning and Development
          </Button>
          <Button onClick={() => setCategory(8)}>Other Information</Button>
        </div>
      </div>
      <div className="container border rounded-2xl m-5">
        {renderCategoryComponent()}
      </div>
    </div>
  );
}
