"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Office = {
  id: number;
  name: string;
  acronym: string;

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
  officeTag: [
    {
      tag: {
        id: number;
        name: string;
      };
    }
  ];
  status: "Active" | "Inactive";
};

export const columns: ColumnDef<Office>[] = [
  {
    accessorKey: "office",
    accessorFn: (office) => office.acronym + office.name,
    header: "Office",
    cell: ({ row }) => {
      return row.original.acronym;
    },
  },
  {
    accessorKey: "phoneNumber",
    accessorFn: ({ phoneNumber }) =>
      phoneNumber.flatMap(({ number }) => number).toString(),
    header: "Phone Number",
    cell: ({ row }) => {
      return row.original.phoneNumber.map((e, index) => {
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
    accessorKey: "emailAddress",
    accessorFn: ({ emailAddress }) =>
      emailAddress.flatMap(({ email }) => email).toString(),
    header: "Email Address",
    cell: ({ row }) => {
      return row.original.emailAddress.map((e, index) => {
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
  //   {
  //     accessorKey: "personTag",
  //     accessorFn: ({ personTag }) =>
  //       personTag.map(({ tag }) => tag.name).toString(),
  //     header: "Tags",
  //     cell: ({ row }) => {
  //       return row.original.personTag.map((e, index) => {
  //         return <div key={index}>{e.tag.name}</div>;
  //       });
  //     },
  //   },
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
