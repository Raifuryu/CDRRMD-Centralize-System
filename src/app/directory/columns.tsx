"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Office } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Person = {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  extension_name: string;
  office: {
    id: number;
    name: string;
    acronym: string;
  };
  phoneNumber: [
    {
      id: number;
      number: string;
      statusId: number;
    }
  ];
  emailAddress: [
    {
      id: number;
      email: String;
      statusId: number;
    }
  ];
  personTag: [
    {
      tag: {
        id: number;
        name: string;
      };
    }
  ];
  status: "Active" | "Inactive";
};

export const columns: ColumnDef<Person>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Avatar",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>
          <Skeleton className="h-12 w-12 rounded-full" />
        </AvatarFallback>
      </Avatar>
    ),
  },
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
    accessorKey: "office",
    accessorFn: ({ office }) => office.acronym + office.name,
    header: "Office",
    cell: ({ row }) => {
      return row.original.office.acronym;
    },
  },
  {
    accessorKey: "phoneNumber",
    accessorFn: ({ phoneNumber }) =>
      phoneNumber.flatMap(({ number }) => number).toString(),
    header: "Phone Number",
    cell: ({ row }) => {
      return (
        <a href={`tel:${row.getValue("phoneNumber")}`}>
          {row.getValue("phoneNumber")}
        </a>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "emailAddress",
    accessorFn: ({ emailAddress }) =>
      emailAddress.flatMap(({ email }) => email).toString(),
    header: "Email Address",
    cell: ({ row }) => {
      return (
        <a href={`tel:${row.getValue("emailAddress")}`}>
          {row.getValue("emailAddress")}
        </a>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "personTag",
    accessorFn: ({ personTag }) =>
      personTag.map(({ tag }) => tag.name).toString(),
    header: "Tags",
  },
];
