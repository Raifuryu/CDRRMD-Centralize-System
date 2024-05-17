"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

export default function SheetForm() {
  const form = useForm();
  const onSubmit = () => {};
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
                <p>Add Participants</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <SheetContent className="max-w-[xxxxpx] sm:max-w-[650px]">
          <SheetHeader>
            <SheetTitle>Training Form</SheetTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>

              </form>
            </Form>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </main>
  );
}
