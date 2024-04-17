"use client";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";

import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";

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

import { Check, ChevronsUpDown } from "lucide-react";

const formSchema = z.object({
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  extensionName: z.string(),
  officeId: z.number(),
  phoneNumber: z.string(),
  emailAddress: z.string().email(),
});

const officeData = z.object({
  id: z.number(),
  name: z.string(),
  acronym: z.string(),
});

type OfficeData = z.infer<typeof officeData>;

const ComboBoxOptionsSchema = z.object({
  value: z.number(),
  label: z.string(),
  acronym: z.string(),
});

type ComboBoxOptions = z.infer<typeof ComboBoxOptionsSchema>;

export default function AddForm({ officeData }: { officeData: OfficeData[] }) {
  const mappedOptions: ComboBoxOptions[] = officeData.map(
    (office: { id: number; name: string; acronym: string }) => ({
      value: office.id,
      label: office.name,
      acronym: office.acronym,
    })
  );

  const comboBoxOptions = mappedOptions;

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      middleName: ""
      extensionName: ""
      phoneNumber: ""
      emailAddress: ""
    },
  });

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3000/api/directory" {
      method: "POST"
      headers: {
        "Content-Type": "application/json"
        // "API-Key": process.env.DATA_API_KEY!,
      },
      body: JSON.stringify(form.getValues()),
    });
    const data = await res.json();
    if (data.success) {
      toast({
        title: "Posted Success"
        description: `${form.getValues("firstName")} has been added`,
      });
    } else {
      toast({
        title: "Failed to add"
      });
    }
  };

  return <></>;
}
