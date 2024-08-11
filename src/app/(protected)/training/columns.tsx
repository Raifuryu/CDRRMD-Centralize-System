"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { date } from "zod";

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
  TrainingHost: [
    {
      office: {
        name: string;
        acronym: string;
      };
    }
  ];
  TrainingDocuments: [
    {
      afterActivityReport: boolean;
      documentation: boolean;
    }
  ];
  requestingOffice: {
    name: string;
    acronym: string;
  };
  venue: string;
  startDate: Date;
  endDate: Date;
  remarks: string | null;
  contactPerson: string;
  contactNumber: string;
  status: string;
  pax: number; // Add the 'pax' property
};

export const columns: ColumnDef<Training>[] = [
  {
    accessorKey: "course",
    accessorFn: ({ TrainingCourse }) =>
      TrainingCourse.map(({ course }) => course.name).toString(),
    header: "Course",
    cell: ({ row }) => {
      return row.original.TrainingCourse.map((e, index) => (
        <div
          key={index}
          className="border rounded-2xl p-1 my-1 bg-white drop-shadow-md"
        >
          {index + 1 + ". " + e.course.name}
        </div>
      ));
    },
    enableSorting: false,
  },
  {
    accessorKey: "office",
    accessorFn: ({ requestingOffice }) =>
      requestingOffice.name + " (" + requestingOffice.acronym + ")",
    header: "Requesting Office",
    // enableSorting: false,
  },
  {
    accessorKey: "venue",
    header: "Venue",
  },
  {
    accessorKey: "startDate",
    accessorFn: ({ startDate }) => (startDate ? startDate : "No Date"),
    header: "Start Date",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {format(row.original.startDate, "LLLL dd, yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    accessorFn: ({ endDate }) => (endDate ? endDate : "No Date"),
    header: "End Date",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {format(row.original.endDate, "LLLL dd, yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "pax",
    header: "No. of Participants",
    cell: ({ row }) => {
      return <div className="text-center">{row.original.pax}</div>;
    },
  },
  {
    accessorKey: "contactPerson",
    header: "Contact Person",
    // enableSorting: false,
    cell: ({ row }) => {
      return (
        <div>
          <div className="text-center">{row.original.contactPerson}</div>
          <div className="text-center">{row.original.contactNumber}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    enableSorting: false,
  },
  {
    accessorFn: ({ startDate, endDate, TrainingDocuments, status }) => {
      if (status === "Canceled") {
        return "Canceled";
      }

      const currentDate = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);

      const isOngoing = currentDate >= start && currentDate <= end;
      const isCompleted = currentDate > end;
      const hasPendingDocuments = TrainingDocuments.some(
        ({ afterActivityReport }) => !afterActivityReport
      );

      const result = [];

      if (isOngoing) {
        result.push("Ongoing");
      } else if (isCompleted) {
        result.push("Completed");
        if (hasPendingDocuments) {
          result.push("Incomplete Documents");
        }
      } else {
        result.push("Waiting");
      }

      return result.join(", ");
    },

    header: "Status",
    cell: ({ row }) => {
      const currentDate = new Date();
      const startDate = new Date(row.original.startDate);
      const endDate = new Date(row.original.endDate);

      return row.original.status == "Canceled" ? (
        <div className="flex flex-wrap gap-2">
          <div className="bg-red-500 text-white px-2 py-1 rounded-2xl whitespace-nowrap shadow-md">
            Canceled
          </div>
        </div>
      ) : currentDate >= startDate && currentDate <= endDate ? (
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-500 text-white px-2 py-1 rounded-2xl whitespace-nowrap shadow-md">
            Ongoing
          </span>
        </div>
      ) : endDate < currentDate ? (
        <div className="flex flex-wrap gap-2">
          <span className="bg-green-500 text-white px-2 py-1 rounded-2xl whitespace-nowrap shadow-md">
            Completed
          </span>
          {row.original.TrainingDocuments.length > 0 ? (
            ""
          ) : (
            <span className="bg-red-500 text-white px-2 py-1 rounded-2xl whitespace-nowrap shadow-md">
              Incomplete Documents
            </span>
          )}
          {/* red 700 for cancel */}
        </div>
      ) : (
        <span className="bg-gray-500 text-white px-2 py-1 rounded-2xl shadow-md">
          Waiting
        </span>
      );
    },
  },
  {
    accessorKey: "id",
    header: "View",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button className="bg-gray-500 text-white">
          <Link href={`/training/${row.original.id}`}>View</Link>
        </Button>
      </div>
    ),
  },
];
