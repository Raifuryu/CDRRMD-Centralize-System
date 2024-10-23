"use client";

import React from "react";
import { cardData, categories, getDccLinks } from "@/lib/links";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface ModuleData {
  moduleId: number;
  title: string;
  enabled: boolean;
}

// Dynamically build the schema based on cardData and getDccLinks
const buildDynamicSchema = () => {
  const schemaShape: Record<string, z.ZodBoolean> = {};

  categories.forEach(({ name }) => {
    cardData[name].forEach(({ title }) => {
      schemaShape[title] = z.boolean();
    });
  });

  // Get DCC links and include them in the schema for specific categories
  const dccLinks = getDccLinks(""); // Replace with actual IP address if necessary
  const operationsAndWarnings = ["Operations and Warning"];

  operationsAndWarnings.forEach((categoryName) => {
    if (cardData[categoryName]) {
      dccLinks.forEach(({ title }) => {
        schemaShape[title] = z.boolean();
      });
    }
  });

  return z.object(schemaShape);
};

const FormSchema = buildDynamicSchema();

const buildDefaultValues = () => {
  const defaultValues: Record<string, boolean> = {};

  categories.forEach(({ name }) => {
    cardData[name].forEach(({ title }) => {
      defaultValues[title] = true; // Default to true for each switch
    });
  });

  // Set default values for DCC links in Operations and Warning categories
  const dccLinks = getDccLinks(""); // Replace with actual IP address if necessary
  const operationsAndWarnings = ["Operations and Warning"];

  operationsAndWarnings.forEach((categoryName) => {
    if (cardData[categoryName]) {
      dccLinks.forEach(({ title }) => {
        defaultValues[title] = true; // Default to true for each DCC link
      });
    }
  });

  return defaultValues;
};

const ModuleSwitch = ({ personId }: { personId: number }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: buildDefaultValues(),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const processedData: ModuleData[] = [];

    categories.forEach(({ name }) => {
      cardData[name].forEach(({ moduleId, title }) => {
        processedData.push({
          moduleId,
          title,
          enabled: data[title], // Use the title from the form to check if the switch is on or off
        });
      });
    });

    // Add DCC links to processedData specifically for Operations and Warning categories
    const dccLinks = getDccLinks(""); // Replace with actual IP address if necessary
    const operationsAndWarnings = ["Operations and Warning"];

    operationsAndWarnings.forEach((categoryName) => {
      if (cardData[categoryName]) {
        dccLinks.forEach(({ moduleId, title }) => {
          processedData.push({
            moduleId,
            title,
            enabled: data[title], // Use the title from the form to check if the switch is on or off
          });
        });
      }
    });

    // Send the processed data to the API
    const res = await fetch("/api/admin/modules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ personId, modules: processedData }), // Send personId and processed data
    });

    if (!res.ok) {
      toast({
        title: "Error submitting data",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-red-600 p-4">
            <code className="text-white">
              {JSON.stringify(await res.json(), null, 2)}
            </code>
          </pre>
        ),
      });
      return;
    }

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(processedData, null, 2)}
          </code>
        </pre>
      ),
    });
  }

  return (
    <div className="container p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div className="grid grid-cols-3">
            {categories.map(({ name }, category_index) => (
              <div
                className="border rounded-2xl"
                key={`category-${name}-${category_index}`}
              >
                <div>{name}</div>
                {cardData[name].map(({ title }, card_index) => (
                  <FormField
                    key={`card-${title}-${card_index}`}
                    control={form.control}
                    name={title}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>{title}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                            aria-readonly
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
                {/* Add DCC Links here if the category is Operations or Warning */}
                {["Operations and Warning"].includes(name) &&
                  getDccLinks("").map(({ moduleId, title }, card_index) => (
                    <FormField
                      key={`dcc-${title}-${card_index}`}
                      control={form.control}
                      name={title}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>{title}</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                              aria-readonly
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
              </div>
            ))}
          </div>
          <Button type="submit" disabled={!personId}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ModuleSwitch;
