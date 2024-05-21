"use client";

import * as z from "zod";
import { PersonnelSchema } from "@/schemas/personnelDefinitions";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

type Personnel = z.infer<typeof PersonnelSchema>;

export const columns: ColumnDef<Personnel>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "middleName",
    header: "Middle Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "extensionName",
    header: "Extension Name",
  },
  {
    accessorKey: "",
    header: "Division",
  },
  {
    accessorKey: "",
    header: "Unit",
  },
  {
    accessorKey: "",
    header: "Section",
  },
  {
    accessorKey: "id",
    header: "View",
    cell: ({ row }) => {
      return <Link href={`hris/${row.original.id}`}>View</Link>;
    },
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableSorting: false,
  },
];
