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
    accessorKey: "name",
    header: "Evac. Center Name",
  },
  {
    accessorKey: "barangay",
    header: "Barangay",
  },
  {
    accessorKey: "sitio",
    header: "Sitio",
  },
  {
    accessorKey: "individual",
    header: "Individual",
  },
  {
    accessorKey: "family",
    header: "Family",
  },
  {
    accessorKey: "governmentOwned",
    header: "Is Gov.",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "isAssessed",
    header: "Assessed",
  },
  {
    accessorKey: "hasMOA",
    header: "Moa",
  },
  {
    accessorKey: "onCMP",
    header: "CMP",
  },
];
