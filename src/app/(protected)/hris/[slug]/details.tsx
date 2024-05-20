"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { number, z } from "zod";

import { Button } from "@/components/ui/button";
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
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { PersonnelSchema } from "@/schemas/personnelSchema";

const TrainingSchema = z.object({
  host: z.string(),
  name: z.string(),
  date: z.date(),
  hours: z.string(),
  status: z.enum(["Completion", "Attendance", "Participation"]),
  certificate: z.instanceof(File),
});

export default function Details({ id }: { id: number }) {
  const trainingForm = useForm<z.infer<typeof TrainingSchema>>({
    resolver: zodResolver(TrainingSchema),
    // defaultValues: {
    //   username: "",
    // },
  });

  const personnelForm = useForm<z.infer<typeof PersonnelSchema>>({
    resolver: zodResolver(TrainingSchema),
    // defaultValues: {
    //   username: "",
    // },
  });

  async function onSubmit(data: z.infer<typeof TrainingSchema>) {
    const res = await fetch("/api/hris", {
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
    <div className="container border rounded-2xl p-4 mt-5">
      <div className="container border rounded-2xl p-4 mt-5">
        <h6>Personnal Information</h6>
        <Form {...personnelForm}>
          <form
            // onSubmit={personnelForm.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={personnelForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personnelForm.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="The" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personnelForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personnelForm.control}
              name="extensionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extension Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
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
                  <Popover>
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
                    <Input placeholder="10" min="1" type="number" {...field} />
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
                        onChange(event.target.files && event.target.files[0])
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
    </div>
  );
}
