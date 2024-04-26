"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  //   id: string;
  category: string;
  name: string;
  barangay: string;
  inspectionDate: string;
  status: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "name",
    header: "Facility Name",
  },
  {
    accessorKey: "inspectionDate",
    header: "Inspection Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
