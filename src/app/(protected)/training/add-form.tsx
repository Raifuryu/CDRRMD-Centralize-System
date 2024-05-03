"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultiSelectFormField from "@/components/ui/multi-select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { addDays, format } from "date-fns";
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

import { trainingSchema } from "@/schemas/trainingDefinitions";
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

export default function TrainingForm() {
  const form = useForm<z.infer<typeof trainingSchema>>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof trainingSchema>) {
    console.log(values);
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
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Training Form</SheetTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Course Selection */}
                <div className="rounded-2xl border p-3 space-y-3">
                  <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course</FormLabel>
                        <FormControl>
                          <MultiSelectFormField
                            options={[
                              { label: "First Aid", value: "1" },
                              { label: "Basic Life Support", value: "2" },
                            ]}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select options"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Venue */}
                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input placeholder="Input Course" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                          <PopoverContent className="w-auto p-0" align="start">
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
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormDescription>Person to contact</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Contact number */}
                  <FormField
                    control={form.control}
                    name="contactPerson"
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
                  {/* Office */}
                  <FormField
                    control={form.control}
                    name="office"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Office to train</FormLabel>
                        <FormControl>
                          <MultiSelectFormField
                            options={[
                              { label: "Not Applicable", value: "1" },
                              {
                                label:
                                  "City Disaster Risk Reduction and Management Department",
                                value: "2",
                              },
                            ]}
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
              </form>
            </Form>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </main>
  );
}
