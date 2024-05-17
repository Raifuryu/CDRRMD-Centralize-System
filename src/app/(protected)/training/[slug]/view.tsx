"use client";

import React from "react";
import * as z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OfficeSchema } from "@/schemas/definitions";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TrainingDocumentsSchema } from "@/schemas/trainingDefinitions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const TrainingSchema = z.object({
  TrainingCourse: z.array(
    z.object({
      course: z.object({
        id: z.number(),
        name: z.string(),
        acronym: z.string(),
      }),
    })
  ),
  TrainingOffice: z.array(
    z.object({
      office: z.object({
        id: z.number(),
        name: z.string(),
        acronym: z.string(),
      }),
    })
  ),
  venue: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  pax: z.number(),
  remarks: z.string(),
  contactPerson: z.string(),
  contactNumber: z.string(),
  trainer: z.object({}),
});

type TrainingData = z.infer<typeof TrainingSchema>;
type TrainingDocumentsData = z.infer<typeof TrainingDocumentsSchema>;
type OfficeData = z.infer<typeof OfficeSchema>;

export default function View({
  trainingData,
  trainerData,
}: {
  trainingData: TrainingData;
  trainerData: OfficeData;
}) {
  const form = useForm<z.infer<typeof TrainingDocumentsSchema>>({
    resolver: zodResolver(TrainingDocumentsSchema),
  });

  async function onSubmit(data: TrainingDocumentsData) {
    const res = await fetch(`/api/training/${}`, {
      // next: { revalidate: 60 },
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "API-Key": process.env.DATA_API_KEY!,
      },
      body: JSON.stringify(data),
    });
  }
  return (
    <div>
      <div className="container flex justify-between space-x-5 mt-5">
        <div className="border rounded-2xl">
          <h4 className="text-sm font-semibold mt-3 ml-3">
            General Information:
          </h4>
          <ScrollArea>
            <div className="h-[200] w-[350px] space-y-2 m-3">
              <div className="rounded-md border px-4 py-3 font-mono text-sm">
                Venue: {trainingData.venue}
              </div>
              <div className="rounded-md border px-4 py-3 font-mono text-sm">
                Date: {format(trainingData.startDate, "LLL dd, yyyy")} -{" "}
                {format(trainingData.endDate, "LLL dd, yyyy")}
              </div>
              <div className="rounded-md border px-4 py-3 font-mono text-sm">
                Pax: {trainingData.pax}
              </div>
              <div className="rounded-md border px-4 py-3 font-mono text-sm">
                Contact Person: {trainingData.contactPerson}
              </div>
              <div className="rounded-md border px-4 py-3 font-mono text-sm">
                Contact Number: {trainingData.contactNumber}
              </div>
            </div>
          </ScrollArea>
        </div>
        <div className="border rounded-2xl">
          <h4 className="text-sm font-semibold mt-3 ml-3">Courses:</h4>
          <ScrollArea>
            <div className="h-[260px] w-[350px] space-y-2 m-3">
              {trainingData.TrainingCourse.map(({ course }, index: number) => (
                <div
                  key={index}
                  className="rounded-md border px-4 py-3 font-mono text-sm"
                >
                  {index + 1 + ". " + course.name}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="border rounded-2xl">
          <ScrollArea>
            <div className="h-[200] w-[350px] space-y-2 m-3">
              <h4 className="text-sm font-semibold mt-3 ml-3">Trainer:</h4>
              <div className="rounded-md border px-4 py-3 font-mono text-sm">
                Trainer: {trainerData.acronym}
              </div>
              <h4 className="text-sm font-semibold mt-3 ml-3">Participants:</h4>
              {trainingData.TrainingOffice.length > 0 ? (
                trainingData.TrainingOffice.map(({ office }) => (
                  <div
                    key={office.acronym}
                    className="rounded-md border px-4 py-3 font-mono text-sm"
                  >
                    {office.acronym}
                  </div>
                ))
              ) : (
                <div className="rounded-md border px-4 py-3 font-mono text-sm">
                  Community
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
      <div>
        <div className="p-5 container border rounded-2xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              encType="multipart/form-data"
              className="w-2/3 space-y-6"
            >
              <div className="flex">
                <FormField
                  control={form.control}
                  name="after_activity_report"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>After Activity Report</FormLabel>
                      <FormControl>
                        <Input
                          accept="application/pdf"
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
                  control={form.control}
                  name="documentation"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Documentation</FormLabel>
                      <FormControl>
                        <Input
                          id="documentation"
                          accept="image/*"
                          type="file"
                          onChange={(event) =>
                            onChange(
                              event.target.files,
                              console.log(event.target.files)
                            )
                          }
                          multiple
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
