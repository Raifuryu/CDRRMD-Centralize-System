"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultiSelectFormField from "@/components/ui/multi-select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  TrainingSchema,
  CourseSchema,
  MultiSelectOptionsSchema,
} from "@/schemas/trainingDefinitions";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import React from "react";
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

type CourseData = z.infer<typeof CourseSchema>;
type OfficeData = z.infer<typeof OfficeSchema>;
type MultiSelectOptions = z.infer<typeof MultiSelectOptionsSchema>;

export default function TrainingForm({
  courseData,
  officeData,
  officeId,
}: {
  courseData: CourseData[];
  officeData: OfficeData[];
  officeId: string;
}) {
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
  }

  return (
    <main>
      <Sheet>
        <div className="fixed bottom-10 right-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger className="rounded-full w-12 h-12 border flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white">
                  <Plus className="w-4 h-4" />
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Training</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <SheetContent className="max-w-[xxxxpx] sm:max-w-[650px] h-full">
          <SheetHeader>
            <SheetTitle>Training Form</SheetTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ScrollArea className="overflow-y-auto">
                  {/* Course Selection */}
                  <div className="rounded-2xl border p-3 space-y-3">
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
                    <div className="flex">
                      <div className="w-1/2">
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
                      </div>
                      <div className="w-1/2">
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
                    </div>
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
                                      {format(field.value.from, "LLL dd, y")} -{" "}
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

                    {/* Venue */}
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
                    {/* Contact Person */}
                    <div className="flex">
                      <div className="w-1/2">
                        <FormField
                          control={form.control}
                          name="contactPerson"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Person</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormDescription>
                                Person to contact
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-1/2">
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

                    {/* Office */}
                    <FormField
                      control={form.control}
                      name="office"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Office to train</FormLabel>
                          <FormControl>
                            <MultiSelectFormField
                              options={officeMultiSelectOptions}
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                              placeholder="Select options"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="mt-3">
                      Submit
                    </Button>
                  </div>
                </ScrollArea>
              </form>
            </Form>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </main>
  );
}
