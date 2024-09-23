"use client";

import { ColumnDef } from "@tanstack/react-table";

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

export const columns: ColumnDef<TrainingData>[] = [
  {
    accessorFn: ({ name }) => name,
    header: "Course",
  },
  {
    accessorFn: ({ TrainingCourse }) => {
      let pendingTrainingCount = 0;
      TrainingCourse.map(({ training }) => {
        training.status === "Active" ? (pendingTrainingCount += 1) : null;
      });
      return pendingTrainingCount;
    },
    header: "Pending",
  },
  {
    accessorFn: ({ TrainingCourse }) => {
      let completedTrainingCount = 0;
      TrainingCourse.map(({ training }) => {
        training.status === "Completed" ? (completedTrainingCount += 1) : null;
      });
      return completedTrainingCount;
    },
    header: "Completed",
  },
  {
    accessorFn: ({ TrainingCourse }) => {
      let completedTrainingCount = 0;
      TrainingCourse.map(({ training }) => {
        training.status === "Canceled" ? (completedTrainingCount += 1) : null;
      });
      return completedTrainingCount;
    },
    header: "Canceled",
  },
  {
    accessorKey: "_count.TrainingCourse",
    header: "Total Requests",
  },
  {
    accessorFn: ({ TrainingCourse }) => {
      let totalParticipants = 0;
      TrainingCourse.map(({ training }) => {
        totalParticipants += training.TrainingParticipants.length;
      });
      return totalParticipants;
    },
    header: "Total Participants",
  },
];
