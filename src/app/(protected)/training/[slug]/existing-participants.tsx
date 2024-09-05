"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MultiSelectFormField from "@/components/ui/multi-select";
import {
  multipleParticipantsSchema,
  multiSelectParticipantOptionSchema,
} from "@/schemas/trainingDefinitions";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SheetAdd from "./sheet-add";
import { barangayOptionsSchema } from "@/schemas/addressDefinitions";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

type multiSelectParticipantOptions = z.infer<
  typeof multiSelectParticipantOptionSchema
>;

type BarangayData = z.infer<typeof barangayOptionsSchema>;

const ExistingParticipants = ({
  trainingId,
  personOptions,
  participantIds,
  barangayData,
  isCanceled,
}: {
  trainingId: string;
  personOptions: multiSelectParticipantOptions[];
  participantIds: string[];
  barangayData: BarangayData[];
  isCanceled: boolean;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const addExistingParticipantsForm = useForm<
    z.infer<typeof multipleParticipantsSchema>
  >({
    resolver: zodResolver(multipleParticipantsSchema),
    defaultValues: {
      trainingId: trainingId,
      participantIds: participantIds,
    },
  });

  async function onSubmitExistingParticipants(
    values: z.infer<typeof multipleParticipantsSchema>
  ) {
    if (
      !values.participantIds.every((id) => participantIds.includes(id)) ||
      participantIds.length !== values.participantIds.length
    ) {
      setIsLoading(!isLoading);
      const res = await fetch(`/api/training/${trainingId}`, {
        // next: { revalidate: 60 },
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // "API-Key": process.env.DATA_API_KEY!,
        },
        body: JSON.stringify(values),
      });
      const response = await res.json();
      if (response.success) {
        toast({
          title: "Success!",
          description: "New Participants Added",
        });
        setIsLoading(!!isLoading);
      } else {
        toast({
          title: "Failed!",
          description:
            "The Server found your request confusing and isn't sure how to proceed",
        });
        setIsLoading(!!isLoading);
      }
      router.refresh();
    } else {
      console.log("No Data Submitted");
    }
  }

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Add Participants</AccordionTrigger>
          <AccordionContent>
            <Form {...addExistingParticipantsForm}>
              <form
                onSubmit={addExistingParticipantsForm.handleSubmit(
                  onSubmitExistingParticipants
                )}
              >
                <div className="grid grid-cols-4 gap-4">
                  <div className="grid col-span-3 ">
                    <FormField
                      control={addExistingParticipantsForm.control}
                      name="participantIds"
                      render={({ field }) => {
                        console.log(field.value.values);
                        return (
                          <FormItem>
                            {/* <FormLabel></FormLabel> */}
                            <FormControl>
                              <MultiSelectFormField
                                options={personOptions}
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                placeholder="Select options"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="submit"
                      className="w-full transition-colors duration-30 hover:bg-slate-500"
                      disabled={isCanceled || isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                    <SheetAdd
                      barangayData={barangayData}
                      trainingId={trainingId}
                      isCanceled={isCanceled}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <h4 className="mt-5">Participants ({participantIds.length})</h4>
    </div>
  );
};

export default ExistingParticipants;
