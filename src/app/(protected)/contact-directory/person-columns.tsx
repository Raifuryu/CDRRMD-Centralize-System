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
  PhoneNumber: [
    {
      id: number;
      number: string;
      statusId: number;
    }
  ];
  EmailAddress: [
    {
      id: number;
      email: String;
      statusId: number;
    }
  ];
  PersonTag: [
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
    header: "Ext. Name",
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
    accessorKey: "PhoneNumber",
    accessorFn: ({ PhoneNumber }) =>
      PhoneNumber.flatMap(({ number }) => number).toString(),
    header: "Phone Number",
    cell: ({ row }) => {
      return row.original.PhoneNumber.map((e, index) => {
        return (
          <div key={index}>
            <a
              href={`tel:${e.number}`}
              className={`${e.statusId === 2 ? "text-red-600" : ""}`}
            >
              {e.number}
            </a>
          </div>
        );
      });
    },
    enableSorting: false,
  },
  {
    accessorKey: "EmailAddress",
    accessorFn: ({ EmailAddress }) =>
      EmailAddress.flatMap(({ email }) => email).toString(),
    header: "Email Address",
    cell: ({ row }) => {
      return row.original.EmailAddress.map((e, index) => {
        return (
          <div key={index}>
            <a
              href={`tel:${e.email}`}
              className={`${e.statusId === 2 ? "text-red-600" : ""}`}
            >
              {e.email}
            </a>
          </div>
        );
      });
    },
    enableSorting: false,
  },
  {
    accessorKey: "PersonTag",
    accessorFn: ({ PersonTag }) => {
      return PersonTag.map(({ tag }) => tag.name).toString();
    },
    header: "Tags",
    cell: ({ row }) => {
      return row.original.PersonTag.map((e, index) => {
        return <div key={index}>{e.tag.name}</div>;
      });
    },
  },
  {
    id: "select",
    // header: ({ table }) => (
    //   <Checkbox
    //     checked={
    //       table.getIsAllPageRowsSelected() ||
    //       (table.getIsSomePageRowsSelected() && "indeterminate")
    //     }
    //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //     aria-label="Select all"
    //   />
    // ),
    header: "Select",
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
];
