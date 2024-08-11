"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as z from "zod";
import { TrainingParticipants } from "@prisma/client";
import { AlignCenter } from "lucide-react";

// Update the type of TrainingParticipants to include the 'serial' and 'person' properties
type UpdatedTrainingParticipants = TrainingParticipants & {
  UniqueSerial: {
    host: string;
    year: number;
    batchNumber: number;
    participantNumber: number;
  };
  person: {
    firstName: string;
    middleName: string | null;
    lastName: string;
    extensionName: string | null;
  };
};

export const columns: ColumnDef<UpdatedTrainingParticipants>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
    
  },
  {
    header: "First Name",
    accessorKey: "person.firstName",
    cell: ({ row }) => {
      return <div className="text-center">{row.original.person.firstName}</div>;
    },
  },
  {
    header: "Middle Name",
    accessorKey: "person.middleName",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.person.middleName ? row.original.person.middleName : ""}
        </div>
      );
    },
  },
  {
    header: "Last Name",
    accessorKey: "person.lastName",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.person.lastName ? row.original.person.lastName : ""}
        </div>
      );
    },
  },
  {
    header: "Extension Name",
    accessorKey: "person.extensionName",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.person?.extensionName || ""}
        </div>
      );
    },
  },
  {
    header: "Serial",
    accessorFn: ({ UniqueSerial }) => {
      return (
        UniqueSerial.host +
        "-" +
        UniqueSerial.year +
        "-" +
        UniqueSerial.batchNumber.toString().padStart(3, "0") +
        "-" +
        UniqueSerial.participantNumber.toString().padStart(3, "0")
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.UniqueSerial.host +
            "-" +
            row.original.UniqueSerial.year +
            "-" +
            row.original.UniqueSerial.batchNumber.toString().padStart(3, "0") +
            "-" +
            row.original.UniqueSerial.participantNumber
              .toString()
              .padStart(3, "0")}
        </div>
      );
    },
  },
];
