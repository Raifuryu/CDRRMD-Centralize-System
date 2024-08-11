"use client";

import { redirect, useRouter } from "next/navigation";
import React from "react";
import * as z from "zod";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { officeSchema } from "@/schemas/officeDefinitions";
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
  CourseSchema,
  MultiSelectOptionsSchema,
  TrainingDocumentsSchema,
} from "@/schemas/trainingDefinitions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import MultiSelectFormField from "@/components/ui/multi-select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const passwordSchema = z.object({
  password: z.string(),
});

const trainerSchema = z.object({
  id: z.string({ message: "Password is required to proceed" }),
  name: z.string(),
  // add more fields as needed
});

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
  requestingOffice: officeSchema,
  requestingOfficeId: z.string(),
  TrainingDocuments: z.array(
    z.object({
      id: z.number(),
      afterActivityReport: z.boolean(),
      documentation: z.boolean(),
      numberOfDocumentations: z.number(),
    })
  ),
  documents: TrainingDocumentsSchema,
  id: z.number(),
  venue: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  pax: z.number(),
  remarks: z.string().optional(),
  contactPerson: z.string(),
  contactNumber: z.string(),
  status: z.string(),
  trainerId: z.string(),
  trainer: trainerSchema,
});

const OfficeSelectDataSchema = z.object({
  value: z.string(),
  label: z.string(),
});

type TrainingData = z.infer<typeof TrainingSchema>;
type TrainingDocumentsData = z.infer<typeof TrainingDocumentsSchema>;
type OfficeData = z.infer<typeof officeSchema>;
type CourseData = z.infer<typeof CourseSchema>;
type OfficeSelectData = z.infer<typeof OfficeSelectDataSchema>;

export default function View({
  trainingData,
  documentationData,
  trainerData,
  courseData,
  officeData,
}: {
  trainingData: TrainingData & { requestingOffice: OfficeData };
  documentationData: string[];
  trainerData: OfficeData;
  courseData: CourseData[];
  officeData: OfficeSelectData[];
}) {
  const router = useRouter();

  const isCanceled = trainingData.status == "Canceled" ? true : false;

  const [isUploadingAAR, setIsUploadingAAR] = React.useState(false);
  const [isUploadingDocumentation, setIsUploadingDocumentation] =
    React.useState(false);

  const toggleAARUpload = () => {
    setIsUploadingAAR(!isUploadingAAR);
  };

  const toggleDocumentationUpload = () => {
    setIsUploadingDocumentation(!isUploadingDocumentation);
  };

  const trainingInformationForm = useForm<
    z.infer<typeof TrainingSchema> & { date: { from: Date; to: Date } }
  >({
    // resolver: zodResolver(TrainingSchema),
    defaultValues: {
      venue: trainingData.venue,
      date: {
        from: trainingData.startDate,
        to: trainingData.endDate,
      },
      pax: trainingData.pax,
      contactPerson: trainingData.contactPerson || "",
      contactNumber: trainingData.contactNumber || "",
      remarks: trainingData.remarks,
      trainerId: trainerData.id.toString(),
      requestingOfficeId: trainingData.requestingOffice.id.toString() || "0",
      documents: {
        after_activity_report: undefined,
        documentation: [],
      },
    },
  });

  const deleteForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const TrainingCourseSchema = z.object({
    trainingId: z.number().int(),
    TrainingCourse: z.array(z.string()),
  });

  const trainingCourseForm = useForm<z.infer<typeof TrainingCourseSchema>>({
    // resolver: zodResolver(TrainingSchema),
    defaultValues: {
      TrainingCourse: trainingData.TrainingCourse?.map(({ course }) =>
        course.id.toString()
      ),
    },
  });

  type MultiSelectOptions = z.infer<typeof MultiSelectOptionsSchema>;

  const courseMultiSelectOptions: MultiSelectOptions[] = courseData.map(
    (courseData: { id: string; name: string }) => ({
      key: courseData.id,
      value: courseData.id.toString(),
      label: courseData.name,
    })
  );

  // const onSubmit = async (data: TrainingDocumentsData) => {
  //   const formData = new FormData();

  //   // Append the after activity report file
  //   if (data.after_activity_report) {
  //     formData.append("after_activity_report", data.after_activity_report);
  //   }

  //   // Append the documentation files
  //   if (data.documentation) {
  //     Array.from(data.documentation).forEach((file, index) => {
  //       formData.append(`documentation_${index}`, file as File);
  //     });
  //   }

  //   try {
  //     const response = await fetch(`/api/training/${trainingData.id}`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const result = await response.json();
  //     form.reset();
  //     router.refresh();
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const updateTrainingInformation = async () => {
    const values = trainingInformationForm.getValues();
    const formData = new FormData();

    // Append files
    if (values.documents.after_activity_report) {
      formData.append(
        "after_activity_report",
        values.documents.after_activity_report
      );
    }

    if (values.documents.documentation) {
      values.documents.documentation.forEach((file: File) => {
        formData.append("documentation", file);
      });
    }

    // Append other fields
    Object.keys(values).forEach((key) => {
      if (key !== "documents") {
        const value = values[key as keyof typeof values];

        if (key === "startDate" || key === "endDate") {
          // Ensure the value is a string before attempting to convert to Date
          if (typeof value === "string" || typeof value === "number") {
            formData.append(key, new Date(value).toISOString());
          }
        } else {
          formData.append(key, JSON.stringify(value));
        }
      }
    });

    if (trainingData.id) {
      formData.append("id", trainingData.id.toString());
    }

    console.log(formData);

    try {
      const response = await fetch(`/api/training/${trainingData.id}`, {
        method: "PUT",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Form submitted successfully");
        toast({
          title: "Success!",
          description: "Updated!",
        });
        router.refresh();
      } else {
        toast({
          title: "Failed!",
          description:
            "The Server found your request confusing and isn't sure how to proceed!",
        });
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const cancelTraining = async () => {
    const data = {
      trainingId: trainingData.id,
      ...deleteForm.getValues(),
    };
    try {
      const response = await fetch(`/api/training/${trainingData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // "API-Key": process.env.DATA_API_KEY!,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log(responseData.success);

      if (response.ok) {
        console.log("Form submitted successfully");
        if (responseData.success) {
          toast({
            title: "Success!",
            description: "Updated!",
          });
          router.refresh();
          router.push("/training");
        }
      } else {
        toast({
          title: "Failed!",
          description:
            "The Server found your request confusing and isn't sure how to proceed",
        });
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const deleteTraining = async () => {
    const data = {
      trainingId: trainingData.id,
      ...deleteForm.getValues(),
    };
    try {
      const response = await fetch(`/api/training/${trainingData.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // "API-Key": process.env.DATA_API_KEY!,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log(responseData.success);

      if (response.ok) {
        console.log("Form submitted successfully");
        if (responseData.success) {
          toast({
            // title: "Success!",
            description: "Training Deleted. Goodbye!",
          });
          router.refresh();
          router.push("/training");
        } else {
          toast({
            title: "Failed!",
            description: responseData.message,
          });
        }
      } else {
        toast({
          title: "Failed!",
          description:
            "The Server found your request confusing and isn't sure how to proceed",
        });
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const updateTrainingCourses = async () => {
    const values = { ...trainingCourseForm.getValues() };

    if (trainingData.id) {
      values.trainingId = trainingData.id;
    }

    try {
      const response = await fetch(`/api/training/${trainingData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // "API-Key": process.env.DATA_API_KEY!,
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: <span className="text-black">Courses Updated!</span>,
          className:
            "bg-green-500 text-white top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        });
        setIsUploadingDocumentation(true);
        setIsUploadingAAR(true);
        router.refresh();
        console.log("Form submitted successfully");
      } else {
        toast({
          title: "Failed!",
          description:
            "The Server found your request confusing and isn't sure how to proceed",
        });
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="mt-10">
      <div className="container flex justify-between items-center">
        <div>
          <Button onClick={() => router.push("/training")}>
            <ArrowLeft />
          </Button>
        </div>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-orange-500" disabled={isCanceled}>
                Cancel Training
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Are you sure you want to Cancel this?</DialogTitle>
                <DialogDescription className="text-red-500">
                  We need the Admin Password to proceed
                </DialogDescription>
              </DialogHeader>
              <Form {...deleteForm}>
                <form
                  onSubmit={deleteForm.handleSubmit(cancelTraining)}
                  className="space-y-8"
                >
                  <FormField
                    control={deleteForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password">Password</Label>
                        <FormControl>
                          <Input
                            type="password"
                            id="password"
                            className="col-span-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" variant="destructive">
                      Confirm
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {/* <Button variant="destructive">Delete Training</Button> */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Training</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Are you sure you want to delete this?</DialogTitle>
                <DialogDescription className="text-red-500">
                  We need the Admin Password to proceed
                </DialogDescription>
              </DialogHeader>
              <Form {...deleteForm}>
                <form
                  onSubmit={deleteForm.handleSubmit(deleteTraining)}
                  className="space-y-8"
                >
                  <FormField
                    control={deleteForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password">Password</Label>
                        <FormControl>
                          <Input
                            type="password"
                            id="password"
                            className="col-span-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" variant="destructive">
                      Confirm
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="container flex justify-between space-x-5 mt-3 border rounded-2xl p-4 shadow-md bg-gray-100">
        <div className="border rounded-2xl shadow-md w-[150%] mx-auto bg-white">
          <h4 className="ml-4">General Information:</h4>

          <Form {...trainingInformationForm}>
            <form
              onSubmit={trainingInformationForm.handleSubmit(
                updateTrainingInformation
              )}
            >
              <div className="grid grid-cols-2 gap-4 m-3 pr-6">
                <div>
                  <FormField
                    control={trainingInformationForm.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input
                            // onBlur={handleBlur}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={trainingInformationForm.control}
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
                            // onBlur={() => console.log("edited")}
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
                  <div className="grid grid-cols-3 gap-1">
                    <FormField
                      control={trainingInformationForm.control}
                      name="pax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. of Trainee</FormLabel>
                          <FormControl>
                            <Input
                              // onBlur={() => console.log("edited")}
                              {...field}
                              type="number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="col-span-2">
                      <FormField
                        control={trainingInformationForm.control}
                        name="requestingOfficeId"
                        render={({ field }) => (
                          <FormItem className="flex flex-col mt-2">
                            <FormLabel>Requesting Office</FormLabel>
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
                                      ? officeData.find(
                                          (office) =>
                                            office.value === field.value
                                        )?.label
                                      : "Select Office"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput placeholder="Search Office..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No office found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {officeData.map((office) => (
                                        <CommandItem
                                          value={office.label}
                                          key={office.value}
                                          onSelect={() => {
                                            field.onChange(office.value);
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
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <FormField
                    control={trainingInformationForm.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <Input
                            // onBlur={() => console.log("edited")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={trainingInformationForm.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input
                            // onBlur={() => console.log("edited Venue")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={trainingInformationForm.control}
                    name="trainerId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Trainer</FormLabel>
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
                                disabled
                              >
                                {field.value
                                  ? officeData.find(
                                      (office) => office.value === field.value
                                    )?.label
                                  : "Select Office"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandInput placeholder="Search Office..." />
                              <CommandList>
                                <CommandEmpty>No office found.</CommandEmpty>
                                <CommandGroup>
                                  {officeData.map((office) => (
                                    <CommandItem
                                      value={office.label}
                                      key={office.value}
                                      onSelect={() => {
                                        field.onChange(office.value);
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
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={trainingInformationForm.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="container border rounded-2xl gap-4 p-4 my-2 shadow-md">
                    <div className="flex justify-center">
                      <h4>Upload Documents</h4>
                    </div>
                    {trainingData.TrainingDocuments[0]?.afterActivityReport &&
                    !isUploadingAAR ? (
                      <div className="flex items-center">
                        <Dialog>
                          <DialogTrigger className="border rounded-md w-full p-2">
                            View AAR
                          </DialogTrigger>
                          <DialogContent className="w-3/4 h-3/4 max-w-none">
                            <Carousel>
                              <CarouselContent>
                                <CarouselItem>
                                  <iframe
                                    src={`/uploads/training/${trainingData.id}/After_Activity_Report.pdf`}
                                    width="100%"
                                    height="700px"
                                    style={{ border: "none" }}
                                    title="After Activity Report"
                                  />
                                </CarouselItem>
                              </CarouselContent>
                              <CarouselPrevious />
                              <CarouselNext />
                            </Carousel>
                          </DialogContent>
                        </Dialog>
                        <Button
                          onClick={toggleAARUpload}
                          variant="ghost"
                          className="ml-2 p-2 rounded-full"
                        >
                          <X className="h-5" />
                        </Button>
                      </div>
                    ) : (
                      <FormField
                        control={trainingInformationForm.control}
                        name="documents.after_activity_report"
                        render={({
                          field: { value, onChange, ...fieldProps },
                        }) => (
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
                    )}

                    {trainingData.TrainingDocuments[0]?.documentation &&
                    !isUploadingDocumentation ? (
                      <div className="flex items-center">
                        <Dialog>
                          <DialogTrigger className="border rounded-md w-full p-2">
                            View Documentation
                          </DialogTrigger>
                          <DialogContent className="w-3/4 h-3/4 max-w-none">
                            <div className="h-full">
                              <Carousel className="h-full">
                                <CarouselContent className="h-full">
                                  {documentationData.map((item) => (
                                    <CarouselItem className="h-full" key={item}>
                                      <div className="relative h-full">
                                        <Image
                                          src={`/uploads/training/${trainingData.id}/documentation/${item}`}
                                          alt="Documentation"
                                          width={1200}
                                          height={400}
                                        />
                                      </div>
                                    </CarouselItem>
                                  ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                              </Carousel>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          onClick={toggleDocumentationUpload}
                          variant="ghost"
                          className="ml-2 p-2 rounded-full"
                        >
                          <X className="h-5" />
                        </Button>
                      </div>
                    ) : (
                      <FormField
                        control={trainingInformationForm.control}
                        name="documents.documentation"
                        render={({
                          field: { value, onChange, ...fieldProps },
                        }) => (
                          <FormItem>
                            <FormLabel>Photo Documentation</FormLabel>
                            <FormControl>
                              <Input
                                id="documentation"
                                accept="image/*,video/*"
                                type="file"
                                onChange={(event) => {
                                  onChange(
                                    event.target.files
                                      ? Array.from(event.target.files)
                                      : []
                                  );
                                }}
                                multiple
                                {...fieldProps}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="p-4 w-[98%] m-2 transition-colors duration-300 hover:bg-slate-500 "
                disabled={isCanceled}
              >
                Update
              </Button>
            </form>
          </Form>
        </div>

        <div className="border rounded-2xl px-3 shadow-md w-full bg-white">
          <Form {...trainingCourseForm}>
            <form
              onSubmit={trainingCourseForm.handleSubmit(updateTrainingCourses)}
            >
              <FormField
                control={trainingCourseForm.control}
                name="TrainingCourse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <h4 className="text-sm font-semibold mt-3 ml-3">
                        Courses:
                      </h4>
                    </FormLabel>
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
              <Button
                type="submit"
                className="my-4 p-4 w-full transition-colors duration-300 hover:bg-slate-500"
                disabled={isCanceled}
              >
                Update
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
