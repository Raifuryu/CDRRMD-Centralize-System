"use client";

import { cn } from "@/lib/utils";
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
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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

import { Check, ChevronsUpDown, Minus, Plus } from "lucide-react";
import { revalidatePerson } from "@/lib/action";
import MultiSelectFormField from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  middleName: z.string(),
  lastName: z.string().min(1, { message: "First Name is required" }),
  extensionName: z.string(),
  officeId: z.number().int({ message: "Office is required" }),
  phoneNumber: z.array(
    z.object({
      number: z.string().min(10, { message: "Phone Number is required" }),
    })
  ),
  emailAddress: z.array(z.object({ email: z.string() })),
  tag: z.array(z.any()),
});

const officeData = z.object({
  id: z.number(),
  name: z.string(),
  acronym: z.string(),
});

type OfficeData = z.infer<typeof officeData>;

const tagData = z.object({
  id: z.string(),
  name: z.string(),
});

type TagData = z.infer<typeof tagData>;

const MultiSelectOptionsSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const ComboBoxOptionsSchema = z.object({
  value: z.number(),
  label: z.string(),
  acronym: z.string(),
});

const FormStateSchema = z.enum(["POST", "PUT"]);

type FormState = z.infer<typeof FormStateSchema>;

type ComboBoxOptions = z.infer<typeof ComboBoxOptionsSchema>;

type MultiSelectOptions = z.infer<typeof MultiSelectOptionsSchema>;

export default function ViewForm({
  officeData,
  tagData,
}: {
  officeData: OfficeData[];
  tagData: TagData[];
}) {
  const { toast } = useToast();
  const [formState, setFormState] = React.useState<FormState>("POST");
  const [isPost, setIsPost] = React.useState(true);

  const comboBoxOptions: ComboBoxOptions[] = officeData.map(
    (office: { id: number; name: string; acronym: string }) => ({
      key: office.id,
      value: office.id,
      label: office.name,
      acronym: office.acronym,
    })
  );

  const multiSelectOptions: MultiSelectOptions[] = tagData.map(
    (tag: { id: string; name: string }) => ({
      key: tag.id,
      value: tag.id,
      label: tag.name,
    })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      extensionName: "",
      officeId: 0,
      phoneNumber: [{ number: "" }],
      emailAddress: [{ email: "" }],
      tag: [],
    },
  });

  const {
    fields: phoneNumberField,
    append: appendPhoneNumberField,
    remove: removePhoneNumberField,
  } = useFieldArray({
    name: "phoneNumber",
    control: form.control,
  });

  const {
    fields: emailAddressField,
    append: appendEmailAddressField,
    remove: removeEmailAddressField,
  } = useFieldArray({
    name: "emailAddress",
    control: form.control,
  });

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3000/api/directory", {
      // next: { revalidate: 60 },
      method: formState,
      headers: {
        "Content-Type": "application/json",
        // "API-Key": process.env.DATA_API_KEY!,
      },
      body: JSON.stringify(form.getValues()),
    });

    const data = await res.json();
    revalidatePerson();

    if (data.success) {
      toast({
        title: "Posted Success",
        description: `${form.getValues("firstName")} has been added`,
      });
    } else {
      toast({
        title: "Failed to add",
      });
    }
    form.reset();
  };

  return (
    <div>
      <div className="flex items-center space-x-2 m-2">
        <Label htmlFor="formState-mode">Update Data</Label>
        <Switch
          id="formState-mode"
          checked={isPost}
          onCheckedChange={() => {
            setIsPost(!isPost),
              isPost ? setFormState("POST") : setFormState("PUT");
          }}
        />
        <Label htmlFor="formState-mode">Submit Data</Label>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-4 py-4 mx-1">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="The" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="extensionName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Extension Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Finest" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="officeId"
              render={({ field }) => (
                <div>
                  <FormItem className="flex flex-col flex-grow-0">
                    <FormLabel>Agency</FormLabel>
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
                              ? comboBoxOptions.find(
                                  (option) => option.value === field.value
                                )?.label
                              : "Select agency"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command
                          filter={(value, search, keywords = []) => {
                            const extendValue = keywords.toString();
                            if (
                              extendValue
                                .toLowerCase()
                                .includes(search.toLowerCase())
                            ) {
                              return 1;
                            }
                            return 0;
                          }}
                        >
                          <CommandInput placeholder="Search agency..." />
                          <CommandEmpty>No agency found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {comboBoxOptions.map((option) => (
                                <CommandItem
                                  value={option.label}
                                  key={option.value}
                                  keywords={[option.label, option.acronym]}
                                  onSelect={() => {
                                    form.setValue("officeId", option.value);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      option.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {option.label}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <FormLabel>Phone Number</FormLabel>
            {phoneNumberField.map((item, index) => {
              return (
                <div className="flex" key={item.id}>
                  <span className="flex-1">
                    <FormField
                      control={form.control}
                      name={`phoneNumber.${index}.number`}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="09123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </span>

                  <Button
                    className=" mx-2 rounded-3xl"
                    size="icon"
                    variant="destructive"
                    onClick={() => removePhoneNumberField(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            <Button
              // className="w-1/2"
              onClick={(e) => {
                appendPhoneNumberField({ number: "" });
                e.preventDefault();
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Number
            </Button>
            <FormLabel>Email Address</FormLabel>
            {emailAddressField.map((item, index) => {
              return (
                <div className="flex" key={item.id}>
                  <span className="flex-1">
                    <FormField
                      control={form.control}
                      name={`emailAddress.${index}.email`}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="johnthedoe@finest.co"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </span>

                  <Button
                    className=" mx-2 rounded-3xl"
                    size="icon"
                    variant="destructive"
                    onClick={() => removeEmailAddressField(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            <Button
              // className="w-1/4"
              onClick={(e) => {
                appendEmailAddressField({ email: "" });
                e.preventDefault();
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Email
            </Button>
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <FormControl>
                      <MultiSelectFormField
                        options={multiSelectOptions}
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
          <Button className="w-full" type="submit">
            {formState === "POST" ? "Submit" : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
