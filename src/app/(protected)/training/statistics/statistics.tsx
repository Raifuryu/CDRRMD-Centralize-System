"use client";

import React, { useEffect } from "react";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarComponent } from "@/components/ui/calendarAdjusted";
import MultiSelectFormField from "@/components/ui/multi-select";
import {
  CourseSchema,
  MultiSelectOptionsSchema,
} from "@/schemas/trainingDefinitions";
import { z } from "zod";
import { DataTable } from "./data-table";
import { columns } from "./columns";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { CourseChart } from "./courseChart";
import { TrendChart } from "./trendChart";
import { ParticipantsChart } from "./participantsChart";
import { MonthlyCourseChart } from "./monthlyCourseChart";

type CourseData = z.infer<typeof CourseSchema>;
// type TrainingData = z.infer<typeof TrainingSchema>;
type MultiSelectOptions = z.infer<typeof MultiSelectOptionsSchema>;

// Define the Training type
type Training = {
  id: number;
  venue: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  daysOfTraining: number;
  pax: number;
  remarks: string;
  requestingOfficeId: number;
  contactPerson: string | null;
  contactNumber: string | null;
  status: string;
  batchNumber: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  TrainingParticipants: TrainingPerson[];
};

// Define the TrainingPerson type
type TrainingPerson = {
  id: number;
  trainingId: number;
  personId: number;
  status: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

// Define the TrainingCourse type
type TrainingCourse = {
  id: number;
  trainingId: number;
  courseId: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  training: Training;
};

// Define the Course type
type TrainingData = {
  id: number;
  name: string;
  acronym: string;
  description: string;
  type: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  _count: {
    TrainingCourse: number;
  };
  TrainingCourse: TrainingCourse[];
};

export function Statistics({ courseData }: { courseData: CourseData[] }) {
  const [trainingData, setTrainingData] = React.useState<TrainingData[]>([]);
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [courseFilter, setCourseFilter] = React.useState<string[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);

  const trainingStatus = [
    { label: "Active", value: "1" },
    { label: "Completed", value: "2" },
    { label: "Cancelled", value: "3" },
  ];

  const courseMultiSelectOptions: MultiSelectOptions[] = courseData.map(
    (courseData: { id: string; name: string }) => ({
      key: courseData.id,
      value: courseData.id.toString(),
      label: courseData.name,
    })
  );

  const searchFunction = () => {
    console.log("Course Date: ", courseFilter || "All");
    console.log("Start Date: ", format(startDate || new Date(), "PPP"));
    console.log("End Date: ", endDate || new Date());
    console.log(trainingData);
    return [];
  };

  const resetFilter = () => {
    setCourseFilter([]), setStartDate(undefined), setEndDate(undefined);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await fetch("http://localhost:3000/api/training/statistics", {
      // next: { revalidate: 60 },
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "API-Key": process.env.DATA_API_KEY!,
      },
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }
    const data = await res.json();
    setTrainingData(data);
    console.log(data);
  };

  return (
    <div className="mt-10">
      <div className="container">
        <div className="flex justify-end space-x-4">
          <MultiSelectFormField
            options={courseMultiSelectOptions}
            defaultValue={courseFilter}
            onValueChange={setCourseFilter}
            placeholder="Select course"
          />
          <MultiSelectFormField
            options={trainingStatus}
            defaultValue={statusFilter}
            onValueChange={setStatusFilter}
            placeholder="Select status"
          />
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "w-60 pl-3 text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
                variant="outline"
              >
                {startDate ? (
                  format(startDate, "dd/MM/yyyy")
                ) : (
                  <span>Pick a start date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-2">
              <CalendarComponent
                initialFocus
                mode="single"
                selected={startDate}
                translate="en"
                onSelect={setStartDate}
              />
            </PopoverContent>
          </Popover>
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "w-60 pl-3 text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
                variant="outline"
              >
                {endDate ? (
                  format(endDate, "dd/MM/yyyy")
                ) : (
                  <span>Pick a end date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-2">
              <CalendarComponent
                initialFocus
                mode="single"
                selected={endDate}
                translate="en"
                onSelect={setEndDate}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={searchFunction}>Search</Button>
          <Button onClick={resetFilter} variant="destructive">
            Reset
          </Button>
        </div>
      </div>
      <div className="container mt-5">Total Participants:</div>
      <div className="container mt-5">
        <div className="grid grid-cols-2 gap-2">
          <TrendChart />
          <CourseChart />
        </div>
        <div className="grid gap-2">
          <MonthlyCourseChart />
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Training Breakdown</AccordionTrigger>
            <AccordionContent>
              <DataTable data={trainingData} columns={columns} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
