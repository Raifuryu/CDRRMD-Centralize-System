"use client";

import React, { useEffect } from "react";

import { ArrowLeft, CalendarIcon } from "lucide-react";
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
import { MonthlyCourseChart } from "./monthlyCourseChart";
import Link from "next/link";
import { ChartPie } from "./pieChart";

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

type TrainingRawData = {
  id: number;
  venue: string | null;
  startDate: Date | null;
  endDate: Date | null;
  daysOfTraining: number | null;
  pax: number | null;
  remarks: string | null;
  requestingOfficeId: number;
  contactPerson: string | null;
  contactNumber: string | null;
  status: string;
  batchNumber: number;
  createdAt: Date;
  updatedAt: Date;
};

// Arrow function to calculate total number of trainings per month with month name and year, including months with 0 trainings, limited to last 3 years
const getTrainingsPerMonthFormatted = (sessions: TrainingRawData[]) => {
  // Array to map month numbers to month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 2; // Last 3 years (including current year)

  // Initialize the result with all months and 0 values for each year
  const result = monthNames.map((month) => ({
    month,
    [currentYear]: 0,
    [currentYear - 1]: 0,
    [currentYear - 2]: 0,
  }));

  // Process each session
  sessions.forEach((session) => {
    if (session.startDate != null) {
      const startDate = new Date(session.startDate);
      const year = startDate.getFullYear();
      const monthIndex = startDate.getMonth(); // 0-based month index

      // Only process if the session is within the last 3 years
      if (year >= startYear && year <= currentYear) {
        result[monthIndex][year] += 1; // Increment the count for the corresponding year and month
      }
    }
  });

  return result;
};

export function Statistics({
  courseData,
  trainingRawData,
}: {
  courseData: CourseData[];
  trainingRawData: TrainingRawData[];
}) {
  const [unfilteredData, setUnfilteredData] = React.useState<TrainingData[]>(
    []
  );
  const [trainingData, setTrainingData] = React.useState<TrainingData[]>([]);
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  // const [courseFilter, setCourseFilter] = React.useState<string[]>([]);
  // const [statusFilter, setStatusFilter] = React.useState<string[]>([]);

  const trainingStat = getTrainingsPerMonthFormatted(trainingRawData);

  // const trainingStatus = [
  //   { label: "Active", value: "1" },
  //   { label: "Completed", value: "2" },
  //   { label: "Cancelled", value: "3" },
  // ];

  const courseMultiSelectOptions: MultiSelectOptions[] = courseData.map(
    (courseData: { id: string; name: string }) => ({
      key: courseData.id,
      value: courseData.id.toString(),
      label: courseData.name,
    })
  );

  const searchFunction = () => {
    const newData = filterCoursesByDate(
      trainingData,
      startDate || new Date(new Date().getFullYear(), 0, 1),
      endDate || new Date()
    );
    setTrainingData(newData);
  };

  const resetFilter = () => {
    // setCourseFilter([]),
    setStartDate(undefined), setEndDate(undefined);
    setTrainingData(unfilteredData);
  };

  function filterCoursesByDate(
    courses: TrainingData[],
    startDate: Date,
    endDate: Date
  ): TrainingData[] {
    // Convert user input date strings to Date objects
    const userStartDate = new Date(startDate);
    const userEndDate = new Date(endDate);

    // Filter courses based on the training's start and end dates
    return courses.map((course) => {
      // Filter each course's TrainingCourse array
      const filteredTrainingCourses = course.TrainingCourse.filter(
        (trainingCourse) => {
          const trainingStartDate = new Date(trainingCourse.training.startDate);
          const trainingEndDate = new Date(trainingCourse.training.endDate);

          // Check if training dates fall within the user-given date range
          return (
            trainingStartDate >= userStartDate && trainingEndDate <= userEndDate
          );
        }
      );

      // Return the course with filtered TrainingCourses
      return {
        ...course,
        TrainingCourse: filteredTrainingCourses,
      };
    });
  }

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await fetch("/api/training/statistics", {
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
    setUnfilteredData(data);
  };

  return (
    <div className="mt-10">
      <div className="container">
        <Button asChild className="my-5">
          <Link href="/training">
            <ArrowLeft />
          </Link>
        </Button>
        <div className="flex space-x-4">
          {/* <MultiSelectFormField
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
          /> */}
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
      <div className="container mt-5">
        {/* <div className="grid grid-cols-2 gap-2 my-2">
          <TrendChart trainingStat={trainingStat} />
          <CourseChart />
        </div>
        <div className="grid gap-2">
          <MonthlyCourseChart />
        </div> */}
        <div className="mt-5 mb-5">
          {/* <ChartPie data={} filters={} /> */}
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
    </div>
  );
}
