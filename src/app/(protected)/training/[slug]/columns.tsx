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
  firstName: string;
  middleName: string;
  lastName: string;
  extensionName: string;
  office: string;
};

export const columns: ColumnDef<Training>[] = [
  {
    header: "First Name",
  },
  {
    header: "Middle Name",
  },
  {
    header: "Last Name",
  },
  {
    header: "Extension Name",
  },
  {
    header: "Office",
  },
];
