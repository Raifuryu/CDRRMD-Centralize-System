"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

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
    enableSorting: false,
  },
  {
    accessorKey: "office",
    accessorFn: ({ TrainingOffice }) =>
      TrainingOffice.map(({ office }) => office.acronym),
    header: "Office",
    cell: ({ row }) => {
      return row.original.TrainingOffice.map((e, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>{index + 1 + ". " + e.office.acronym.toString()}</div>
            </TooltipTrigger>
            <TooltipContent>{e.office.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ));
    },
    enableSorting: false,
  },
  {
    accessorKey: "venue",
    header: "Venue",
  },
  {
    accessorKey: "startDate",
    accessorFn: ({ startDate }) => format(startDate, "yyyy-LLLL-dd"),
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    accessorFn: ({ endDate }) => format(endDate, "yyyy-LLLL-dd"),
    header: "End Date",
  },
  {
    accessorKey: "pax",
    header: "Pax",
  },
  {
    accessorKey: "contactPerson",
    header: "Contact Person",
    enableSorting: false,
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
    enableSorting: false,
  },
  {
    accessorKey: "id",
    header: "View",
    cell: ({ row }) => (
      <Link
        href={`/training/${row.original.id}`}
        className="text-blue-500 underline"
      >
        View
      </Link>
    ),
  },
];
