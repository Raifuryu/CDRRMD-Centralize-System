"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Policies = {
  id: number;
  name: string;
  date_approved: string;
  category: string;
  type: string;
  policy_number: string;
};

export const columns: ColumnDef<Policies>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  //   enableColumnFilter: false,
  //   enableGlobalFilter: false,
  //   enableMultiSort: false,
  // },
  {
    accessorKey: "policy_number",
    header: "Policy Number",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "date_approved",
    header: "Date Approved",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
];
