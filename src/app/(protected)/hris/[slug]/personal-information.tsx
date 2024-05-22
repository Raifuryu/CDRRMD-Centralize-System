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
import { PersonnelSchema } from "@/schemas/personnelDefinitions";

export default function PersonalInformation({
  personnelId,
}: {
  personnelId: number;
}) {
  const personnelForm = useForm<z.infer<typeof PersonnelSchema>>({
    resolver: zodResolver(PersonnelSchema),
    // defaultValues: {
    //   username: "",
    // },
  });

  async function onSubmit(data: z.infer<typeof PersonnelSchema>) {}

  return (
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
  );
}
