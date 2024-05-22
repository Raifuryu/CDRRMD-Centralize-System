"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Plus } from "lucide-react";
import { PersonnelTrainingSchema } from "@/schemas/personnelDefinitions";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function LearningAndDevelopmentSheet({
  personnelId,
}: {
  personnelId: number;
}) {
  const trainingForm = useForm<z.infer<typeof PersonnelTrainingSchema>>({
    // resolver: zodResolver(PersonnelTrainingSchema),
    defaultValues: {
      personnelId: personnelId,
      host: "",
      name: "",
      date: new Date(),
      hours: "",
      status: "Completion",
    },
  });

  async function onSubmit(data: z.infer<typeof PersonnelTrainingSchema>) {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key as keyof typeof data];
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, JSON.stringify(value));
        }
      }
    }

    const res = await fetch("/api/hris/learning-and-development", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      // Handle error
      console.error("Failed to submit data");
    } else {
      // Handle success
      console.log("Data submitted successfully");
    }
  }

  return (
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
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <div className="container border rounded-2xl p-4 mt-5">
            <h6>Learning and Development</h6>
            <Form {...trainingForm}>
              <form
                onSubmit={trainingForm.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
              >
                <FormField
                  control={trainingForm.control}
                  name="host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Host</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City Disaster Risk Reduction and Management Department"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={trainingForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Basic Life Support" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={trainingForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Training</FormLabel>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={trainingForm.control}
                  name="hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Hours</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10"
                          min="1"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={trainingForm.control}
                  name="certificate"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Certificate</FormLabel>
                      <FormControl>
                        <Input
                          accept="application/pdf, image/*"
                          type="file"
                          onChange={(event) =>
                            onChange(
                              event.target.files && event.target.files[0]
                            )
                          }
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={trainingForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Completion">Completion</SelectItem>
                          <SelectItem value="Participation">
                            Participation
                          </SelectItem>
                          <SelectItem value="Attendance">Attendance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
