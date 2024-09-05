"use client";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultiSelectFormField from "@/components/ui/multi-select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";

import {
  CourseSchema,
  MultiSelectOptionsSchema,
} from "@/schemas/trainingDefinitions";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  CircleEllipsis,
  Plus,
} from "lucide-react";
import React, { ChangeEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OfficeSchema } from "@/schemas/definitions";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { barangayOptionsSchema } from "@/schemas/addressDefinitions";
import { AddOffice } from "./add-office";
import { toast } from "@/components/ui/use-toast";

type BarangayData = z.infer<typeof barangayOptionsSchema>;
type CourseData = z.infer<typeof CourseSchema>;
type OfficeData = z.infer<typeof OfficeSchema>;
type MultiSelectOptions = z.infer<typeof MultiSelectOptionsSchema>;

const TrainingSchema = z.object({
  trainer: z.string(),
  course: z.array(z.string()),
  venue: z.string(),
  date: z.object({ from: z.date(), to: z.date().optional() }).optional(), // You might want to define the structure of the date object based on your requirements
  pax: z.string(),
  remarks: z.string().optional(),
  requestingOffice: z.object({
    id: z.string(),
  }),
  contactPerson: z
    .string()
    .min(1, { message: "Contact Person Can't be empty" }),
  contactNumber: z
    .string()
    .min(1, { message: "Contact Number Can't be empty" }),
  office: z.array(z.string()),
});

export default function TrainingForm({
  courseData,
  officeData,
  officeId,
}: {
  courseData: CourseData[];
  officeData: OfficeData[];
  officeId: string;
}) {
  const router = useRouter();

  const courseMultiSelectOptions: MultiSelectOptions[] = courseData.map(
    (courseData: { id: string; name: string }) => ({
      key: courseData.id,
      value: courseData.id.toString(),
      label: courseData.name,
    })
  );

  const officeMultiSelectOptions: MultiSelectOptions[] = officeData.map(
    (officeData: { id: string; name: string }) => ({
      key: officeData.id,
      value: officeData.id.toString(),
      label: officeData.name,
    })
  );

  const form = useForm<z.infer<typeof TrainingSchema>>({
    resolver: zodResolver(TrainingSchema),
    defaultValues: {
      trainer: officeId,
      course: [],
      venue: "",
      date: {},
      pax: "0",
      remarks: "",
      requestingOffice: { id: "" },
      contactPerson: "",
      contactNumber: "",
      office: [],
    },
  });

  async function onSubmit(values: z.infer<typeof TrainingSchema>) {
    const res = await fetch("/api/training", {
      // next: { revalidate: 60 },
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "API-Key": process.env.DATA_API_KEY!,
      },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      toast({
        title: "Success!",
        description: "New Office Added",
      });
      form.reset();
      router.refresh();
    } else {
      toast({
        title: "Failed!",
        description:
          "The Server found your request confusing and isn't sure how to proceed",
      });
    }
  }

  return (
    <main>
      <Sheet>
        <div className="fixed bottom-10 right-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger className="rounded-full w-12 h-12 border flex items-center justify-center transition-all duration-300 ease-in-out bg-blue-600 hover:bg-blue-400 text-white shadow-md">
                  <Plus className="w-4 h-4" />
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Training</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <SheetContent className="max-w-[xxxxpx] sm:max-w-[650px] overflow-y-scroll">
          <SheetHeader>
            <SheetTitle className="flex justify-between">
              <div>Training Form</div>
              <CircleEllipsis className="mr-4" />
            </SheetTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ScrollArea className="overflow-y-auto">
                  {/* Course Selection */}
                  <div className="rounded-2xl border p-3 space-y-3 shadow-md">
                    <div className="border rounded-2xl shadow-md p-4">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Date */}
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Training Date</FormLabel>
                              <Popover modal={true}>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value?.from ? (
                                      field.value.to ? (
                                        <>
                                          {format(
                                            field.value.from,
                                            "LLL dd, y"
                                          )}{" "}
                                          -{" "}
                                          {format(field.value.to, "LLL dd, y")}
                                        </>
                                      ) : (
                                        format(field.value.from, "LLL dd, y")
                                      )
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={field.value?.from}
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    numberOfMonths={2}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Trainer */}
                        <FormField
                          control={form.control}
                          name="trainer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trainer</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {officeData.map((e) => {
                                    return (
                                      <SelectItem
                                        key={e.id}
                                        value={e.id.toString()}
                                      >
                                        {e.acronym}
                                      </SelectItem>
                                    );
                                  })}
                                  {/* <SelectItem value="m@example.com">
                                m@example.com
                              </SelectItem>
                              <SelectItem value="m@google.com">
                                m@google.com
                              </SelectItem>
                              <SelectItem value="m@support.com">
                                m@support.com
                              </SelectItem> */}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Venue */}
                        <FormField
                          control={form.control}
                          name="venue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Venue</FormLabel>
                              <FormControl>
                                <Input placeholder="Input Venue" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Participants Number */}
                        <FormField
                          control={form.control}
                          name="pax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Participants</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Input Number of Participants"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="course"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course</FormLabel>
                            <FormControl>
                              <MultiSelectFormField
                                options={courseMultiSelectOptions}
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                placeholder="Select options"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Office */}
                    <div className="border rounded-2xl shadow-md p-4">
                      <div>
                        <FormField
                          control={form.control}
                          name="requestingOffice.id"
                          render={({ field }) => (
                            <FormItem>
                              <div className="grid gap-3">
                                <FormLabel>Requesting Office</FormLabel>
                                <Popover modal={true}>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "justify-between",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value
                                          ? officeMultiSelectOptions.find(
                                              (office) =>
                                                office.value === field.value
                                            )?.label
                                          : "Select Office"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[200] p-0">
                                    <Command>
                                      <CommandInput placeholder="Search Office..." />
                                      <CommandList>
                                        <CommandEmpty>
                                          No barangay found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {officeMultiSelectOptions.map(
                                            (office) => (
                                              <CommandItem
                                                value={office.label}
                                                key={office.value}
                                                onSelect={() => {
                                                  form.setValue(
                                                    "requestingOffice.id",
                                                    office.value
                                                  );
                                                }}
                                              >
                                                <Check
                                                  className={cn(
                                                    "mr-2 h-4 w-4",
                                                    office.value === field.value
                                                      ? "opacity-100"
                                                      : "opacity-0"
                                                  )}
                                                />
                                                {office.label}
                                              </CommandItem>
                                            )
                                          )}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {/* Contact Person */}
                      <div className="grid grid-cols-2 gap-2 ">
                        <FormField
                          control={form.control}
                          name="contactPerson"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Person</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Input Requesting Agency"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Contact number */}
                        <FormField
                          control={form.control}
                          name="contactNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Number</FormLabel>
                              <FormControl>
                                <Input placeholder="09123456789" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    {/* Remarks */}
                    <FormField
                      control={form.control}
                      name="remarks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remarks</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder=""
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Remarks of the Training
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <SheetClose className="w-full">
                      <Button type="submit" className="mt-3 w-full">
                        Submit
                      </Button>
                    </SheetClose>
                  </div>
                </ScrollArea>
              </form>
            </Form>
            <AddOffice />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </main>
  );
}
