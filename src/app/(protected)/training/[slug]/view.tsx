"use client";

import React from "react";
import * as z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const TrainingSchema = z.object({
  TrainingCourse: z.array(
    z.object({
      course: z.object({
        id: z.number(),
        name: z.string(),
        acronym: z.string(),
      }),
    })
  ),
  venue: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  pax: z.number(),
  remarks: z.string(),
  contactPerson: z.string(),
  contactNumber: z.string(),
});

type TrainingData = z.infer<typeof TrainingSchema>;

export default function View({ trainingData }: { trainingData: TrainingData }) {
  return (
    <div className="container flex justify-between space-x-5 mt-5">
      <div className="border rounded-2xl">
        <h4 className="text-sm font-semibold mt-3 ml-3">
          General Information:
        </h4>
        <ScrollArea>
          <div className="h-[200] w-[350px] space-y-2 m-3">
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
              Venue: {trainingData.venue}
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
              Date: {format(trainingData.startDate, "LLL dd, yyyy")} -{" "}
              {format(trainingData.endDate, "LLL dd, yyyy")}
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
              Pax: {trainingData.pax}
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
              Contact Person: {trainingData.contactPerson}
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
              Contact Number: {trainingData.contactNumber}
            </div>
          </div>
        </ScrollArea>
      </div>
      <div className="border rounded-2xl">
        <h4 className="text-sm font-semibold mt-3 ml-3">Courses:</h4>
        <ScrollArea>
          <div className="h-[260px] w-[350px] space-y-2 m-3">
            {trainingData.TrainingCourse.map(({ course }, index: number) => (
              <div
                key={index}
                className="rounded-md border px-4 py-3 font-mono text-sm"
              >
                {index + 1 + ". " + course.name}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="border rounded-2xl">
        <h4 className="text-sm font-semibold mt-3 ml-3">Documents:</h4>
        <ScrollArea>
          <div className="h-[260px] w-[350px] space-y-2 m-3">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="aar">After Activity Report</Label>
              <Input id="ar" type="file" />
            </div>
            <Label htmlFor="documentation">Documentations</Label>
            <div
              id="documentation"
              className="grid w-full max-w-sm items-center gap-1.5"
            >
              <Input type="file" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input type="file" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input type="file" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Button>Submit</Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
