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
    cell: ({ row }) => (
      <div className="flex justify-end">{row.original.name}</div>
    ),
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
    cell: ({ row }) => {
      let pendingTrainingCount = 0;
      row.original.TrainingCourse.map(({ training }) => {
        training.status === "Active" ? (pendingTrainingCount += 1) : null;
      });
      return <div className="flex justify-center">{pendingTrainingCount}</div>;
    },
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
    cell: ({ row }) => {
      let completedTrainingCount = 0;
      row.original.TrainingCourse.map(({ training }) => {
        training.status === "Completed" ? (completedTrainingCount += 1) : null;
      });
      return (
        <div className="flex justify-center">{completedTrainingCount}</div>
      );
    },
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
    cell: ({ row }) => {
      let completedTrainingCount = 0;
      row.original.TrainingCourse.map(({ training }) => {
        training.status === "Canceled" ? (completedTrainingCount += 1) : null;
      });
      return (
        <div className="flex justify-center">{completedTrainingCount}</div>
      );
    },
  },
  {
    accessorKey: "TrainingCourse.length",
    header: "Total Requests",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          {row.original.TrainingCourse.length}
        </div>
      );
    },
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
    cell: ({ row }) => {
      let totalParticipants = 0;
      row.original.TrainingCourse.map(({ training }) => {
        totalParticipants += training.TrainingParticipants.length;
      });
      return <div className="flex justify-center">{totalParticipants}</div>;
    },
  },
];
