"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PolicySchema } from "@/schemas/policiesDefinitions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { CalendarComponent } from "@/components/ui/calendarAdjusted";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function AddForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof PolicySchema>>({
    resolver: zodResolver(PolicySchema),
    defaultValues: {
      policyNumber: "",
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof PolicySchema>) {
    const res = await fetch(`/api/policies`, {
      // next: { revalidate: 60 },
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "API-Key": process.env.DATA_API_KEY!,
      },
      body: JSON.stringify(values),
    });
    const response = await res.json();
    if (response.success) {
      toast({
        title: "Success",
        description: "Policy Added!",
      });
      router.refresh();
      form.reset();
    }
  }

  const category = ["CDRRMC", "Sangguniang Panlungsod", "City Mayor's Office"];
  const type = ["Resolution", "Ordinance", "Executive Order"];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Policy</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex justify-center">
                Add Policy
              </DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="policyNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Title" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateApproved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Approved</FormLabel>
                  <FormControl>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            variant="outline"
                          >
                            {field.value ? (
                              format(field.value, "LLLL dd, yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-2">
                        <CalendarComponent
                          initialFocus
                          mode="single"
                          selected={field.value ?? undefined}
                          translate="en"
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {category.map((options) => (
                        <SelectItem key={options} value={options}>
                          {options}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {type.map((options) => (
                        <SelectItem key={options} value={options}>
                          {options}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
