"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Training = {
  id: number;
  TrainingCourse: [
    {
      course: {
        name: string;
        acronym: string;
      };
    }
  ];
  TrainingOffice: [
    {
      office: {
        name: string;
        acronym: string;
      };
    }
  ];
  venue: string;
  startDate: Date;
  endDate: Date;
  remarks: string | null;
  contactPerson: string;
  contactNumber: string;
};

export const columns: ColumnDef<Training>[] = [
  {
    accessorKey: "course",
    accessorFn: ({ TrainingCourse }) =>
      TrainingCourse.map(({ course }) => course.name),
    header: "Course",
    cell: ({ row }) => {
      return row.original.TrainingCourse.map((e, index) => (
        <div key={index}>{index + 1 + ". " + e.course.name.toString()}</div>
      ));
    },
  },
  {
    accessorKey: "office",
    accessorFn: ({ TrainingOffice }) =>
      TrainingOffice.map(({ office }) => office.acronym),
    header: "Office",
    cell: ({ row }) => {
      return row.original.TrainingOffice.map((e, index) => (
        <div key={index}>{index + 1 + ". " + e.office.acronym.toString()}</div>
      ));
    },
  },
  {
    accessorKey: "venue",
    header: "Venue",
  },
  {
    accessorKey: "startDate",
    accessorFn: ({ startDate }) => format(startDate, "yyyy-LLL-dd"),
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    accessorFn: ({ endDate }) => format(endDate, "yyyy-LLL-dd"),
    header: "End Date",
  },
  {
    accessorKey: "pax",
    header: "Pax",
  },
  {
    accessorKey: "contactPerson",
    header: "Contact Person",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
  },
  {
    header: "View",
  },
];
