"use client";

import z from "zod";

import { revalidatePerson } from "@/lib/action";

import { ArrowDown, ArrowUp, X } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ColumnDef,
  getPaginationRowModel,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  RowSelectionState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { useState } from "react";

import React from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Check, ChevronsUpDown, Minus, Plus } from "lucide-react";
import MultiSelectFormField from "@/components/ui/multi-select";

import { cn } from "@/lib/utils";
import { PersonEmailAddress, PersonPhoneNumber } from "@prisma/client";

// data table

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// view form

const formSchema = z.object({
  id: z.number(),
  firstName: z.string().min(1, { message: "First Name is required" }),
  middleName: z.string(),
  lastName: z.string().min(1, { message: "First Name is required" }),
  extensionName: z.string(),
  officeId: z.number().int({ message: "Office is required" }),
  phoneNumber: z.array(
    z.object({
      number: z.string(),
      status: z.boolean().default(true),
    })
  ),
  emailAddress: z.array(
    z.object({ email: z.string(), status: z.boolean().default(true) })
  ),
  tag: z.array(z.any()),
});

const officeData = z.object({
  id: z.number(),
  name: z.string(),
  acronym: z.string(),
});

type OfficeData = z.infer<typeof officeData>;

const tagData = z.object({
  id: z.string(),
  name: z.string(),
});

type TagData = z.infer<typeof tagData>;

const MultiSelectOptionsSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const ComboBoxOptionsSchema = z.object({
  value: z.number(),
  label: z.string(),
  acronym: z.string(),
});

const FormStateSchema = z.enum(["POST", "PUT"]);

type FormState = z.infer<typeof FormStateSchema>;

type ComboBoxOptions = z.infer<typeof ComboBoxOptionsSchema>;

type MultiSelectOptions = z.infer<typeof MultiSelectOptionsSchema>;

export function DataTable<TData, TValue>({
  columns,
  data,
  officeData,
  tagData,
}: DataTableProps<TData, TValue> & {
  officeData: OfficeData[];
  tagData: TagData[];
}) {
  // data table
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // form
  const { toast } = useToast();
  const [formState, setFormState] = React.useState<FormState>("POST");

  // data table
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      columnFilters,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  // form

  const comboBoxOptions: ComboBoxOptions[] = officeData.map(
    (office: { id: number; name: string; acronym: string }) => ({
      key: office.id,
      value: office.id,
      label: office.name,
      acronym: office.acronym,
    })
  );

  const multiSelectOptions: MultiSelectOptions[] = tagData.map(
    (tag: { id: string; name: string }) => ({
      key: tag.id,
      value: tag.id,
      label: tag.name,
    })
  );

  // get data from selected

  const selectedData: any =
    table.getFilteredSelectedRowModel().rows[0]?.original;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      id: 0,
      firstName: "",
      middleName: "",
      lastName: "",
      extensionName: "",
      officeId: 1,
      phoneNumber: [{ number: "", status: true }],
      emailAddress: [{ email: "", status: true }],
      tag: [],
    },
  });

  const {
    fields: phoneNumberField,
    append: appendPhoneNumberField,
    remove: removePhoneNumberField,
  } = useFieldArray({
    name: "phoneNumber",
    control: form.control,
  });

  const {
    fields: emailAddressField,
    append: appendEmailAddressField,
    remove: removeEmailAddressField,
  } = useFieldArray({
    name: "emailAddress",
    control: form.control,
  });

  const handleSubmit = async () => {
    const res = await fetch("/api/directory", {
      // next: { revalidate: 60 },
      method: formState,
      headers: {
        "Content-Type": "application/json",
        // "API-Key": process.env.DATA_API_KEY!,
      },
      body: JSON.stringify(form.getValues()),
    });

    const data = await res.json();
    revalidatePerson();

    if (data.success || data.updated) {
      const firstName = form.getValues("firstName");
      const action = data.success ? "submitted" : "updated";

      toast({
        title: "Posted Success",
        description: `${firstName} has been ${action}`,
      });
    } else {
      toast({
        title: "Failed to add",
      });
    }
    form.reset({
      firstName: "",
      middleName: "",
      lastName: "",
      extensionName: "",
      officeId: 1,
      phoneNumber: [{ number: "", status: true }],
      emailAddress: [{ email: "", status: true }],
      tag: [],
    });
  };

  React.useEffect(() => {
    if (selectedData !== undefined || "") {
      form.reset({
        id: selectedData?.id,
        firstName: selectedData?.firstName,
        middleName: selectedData?.middleName,
        lastName: selectedData?.lastName,
        extensionName: selectedData?.extensionName,
        officeId: selectedData?.officeId,
        phoneNumber: selectedData?.phoneNumber.map((e: PersonPhoneNumber) => {
          // update status for later
          return { number: e.number, status: e.statusId === 1 ? true : false };
        }),
        emailAddress: selectedData?.emailAddress.map(
          (e: PersonEmailAddress) => {
            return { email: e.email, status: e.statusId === 1 ? true : false };
          }
        ),
        tag: selectedData?.personTag.map(
          ({ tagId }: { tagId: number }) => tagId
        ),
      });
      setFormState("PUT");
    } else {
      form.reset({
        firstName: "",
        middleName: "",
        lastName: "",
        extensionName: "",
        officeId: 1,
        phoneNumber: [{ number: "", status: true }],
        emailAddress: [{ email: "", status: true }],
        tag: [],
      });
      setFormState("POST");
    }
  }, [selectedData, setFormState]); // Include setFormState in the dependency array

  return (
    <div className="flex h-full m-5">
      <div className="rounded-2xl border p-4 w-3/4 mr-2">
        <div className="flex justify-between mb-3">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled>
                  Columns Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(e) => e.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="ml-2"
              variant="destructive"
              onClick={() => {
                setGlobalFilter("");
                setColumnFilters([]);
                setRowSelection({});
                form.reset({
                  firstName: "",
                  middleName: "",
                  lastName: "",
                  extensionName: "",
                  officeId: 1,
                  phoneNumber: [{ number: "", status: true }],
                  emailAddress: [{ email: "", status: true }],
                  tag: [],
                });
              }}
            >
              Clear Filter
            </Button>
          </div>

          <div className="w-1/4">
            <Input
              className="ml-auto"
              placeholder="Global filter"
              value={globalFilter ?? ""}
              onChange={(event) => {
                setGlobalFilter(event.target.value);
              }}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <ArrowUp className="ml-2 h-4 w-4" />,
                              desc: <ArrowDown className="ml-2 h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <TableRow>
                {table.getAllColumns().map((e) => (
                  <TableCell key={e.id}>
                    <Input
                      value={
                        (table.getColumn(e.id)?.getFilterValue() as string) ??
                        ""
                      }
                      onChange={(event) =>
                        table
                          .getColumn(e.id)
                          ?.setFilterValue(event.target.value)
                      }
                      className="max-w-sm"
                    />
                  </TableCell>
                ))}
              </TableRow>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-end justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="rounded-2xl border p-4 w-1/4 ml-2">
        <div>Add Form</div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => {
                  return <FormItem></FormItem>;
                }}
              />
              <div className="grid gap-4 py-4 mx-1">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                          {/* {selectedData
                            ? (field.value = selectedData.firstName)
                            : (field.value = "")} */}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input placeholder="The" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="extensionName"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Extension Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Finest" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="officeId"
                  render={({ field }) => (
                    <div>
                      <FormItem className="flex flex-col flex-grow-0">
                        <FormLabel>Agency</FormLabel>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? comboBoxOptions.find(
                                      (option) => option.value === field.value
                                    )?.label
                                  : "Select agency"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command
                              filter={(value, search, keywords = []) => {
                                const extendValue = keywords.toString();
                                if (
                                  extendValue
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                                ) {
                                  return 1;
                                }
                                return 0;
                              }}
                            >
                              <CommandInput placeholder="Search agency..." />
                              <CommandEmpty>No agency found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {comboBoxOptions.map((option) => (
                                    <CommandItem
                                      value={option.label}
                                      key={option.value}
                                      keywords={[option.label, option.acronym]}
                                      onSelect={() => {
                                        form.setValue("officeId", option.value);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          option.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {option.label}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
                <FormLabel>Phone Number</FormLabel>
                {phoneNumberField.map((item, index) => {
                  return (
                    <div className="flex" key={item.id}>
                      <span className="flex-1">
                        <FormField
                          control={form.control}
                          name={`phoneNumber.${index}.number`}
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="09123456789" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </span>
                      <FormField
                        control={form.control}
                        name={`phoneNumber.${index}.status`}
                        render={({ field }) => (
                          <FormItem className="ml-2 flex flex-col items-center justify-between">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel
                              className={`text-xs ${
                                !field.value ? "text-red-500" : ""
                              }`}
                            >
                              {field.value ? "Active" : "Inactive"}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  );
                })}
                <Button
                  // className="w-1/2"
                  onClick={(e) => {
                    appendPhoneNumberField({ number: "", status: true });
                    e.preventDefault();
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Number
                </Button>
                <FormLabel>Email Address</FormLabel>
                {emailAddressField.map((item, index) => {
                  return (
                    <div className="flex" key={item.id}>
                      <span className="flex-1">
                        <FormField
                          control={form.control}
                          name={`emailAddress.${index}.email`}
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="johnthedoe@finest.co"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </span>

                      <FormField
                        control={form.control}
                        name={`emailAddress.${index}.status`}
                        render={({ field }) => (
                          <FormItem className="ml-2 flex flex-col items-center justify-between">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-xs">
                              {field.value ? "Active" : "Inactive"}
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      {/* <Button
                        className=" mx-2 rounded-3xl"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeEmailAddressField(index)}
                        disabled
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button> */}
                    </div>
                  );
                })}
                <Button
                  // className="w-1/4"
                  onClick={(e) => {
                    appendEmailAddressField({ email: "", status: true });
                    e.preventDefault();
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Email
                </Button>
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Tag</FormLabel>
                        <FormControl>
                          <MultiSelectFormField
                            options={multiSelectOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select options"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <Button
                className={`w-full ${
                  formState === "POST" ? "bg-green-600" : "bg-sky-600"
                }`}
                type="submit"
              >
                {formState === "POST" ? "Submit" : "Update"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
