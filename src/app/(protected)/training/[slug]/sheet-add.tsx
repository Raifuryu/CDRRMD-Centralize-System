"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetClose,
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
import { CalendarIcon, Check, ChevronsUpDown, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import {
  multipleParticipantsSchema,
  multiSelectParticipantOptionSchema,
  ParticipantSchema,
} from "@/schemas/trainingDefinitions";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { barangayOptionsSchema } from "@/schemas/addressDefinitions";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CalendarComponent } from "@/components/ui/calendarAdjusted";
import { toast } from "@/components/ui/use-toast";

type BarangayData = z.infer<typeof barangayOptionsSchema>;

export default function SheetForm({
  barangayData,
  trainingId,
  isCanceled,
}: {
  barangayData: BarangayData[];
  trainingId: string;
  isCanceled: boolean;
}) {
  const addParticipantForm = useForm<z.infer<typeof ParticipantSchema>>({
    resolver: zodResolver(ParticipantSchema),
    defaultValues: {
      trainingId: trainingId.toString() || "0",
      firstName: "",
      middleName: "",
      lastName: "",
      extensionName: "",
      bloodtype: "Unknown",
      contactNumber: "",
      emailAddress: "",
      PersonAddress: {
        partialAddress: "",
        sitio: "",
        barangay: "",
      },
    },
  });

  async function onSubmitNewParticipant(
    values: z.infer<typeof ParticipantSchema>
  ) {
    const data = { ...values };

    data.trainingId = trainingId;

    const res = await fetch(`/api/training/${trainingId}`, {
      // next: { revalidate: 60 },
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "API-Key": process.env.DATA_API_KEY!,
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();
    if (response.success) {
      toast({
        title: "Success!",
        description: "New Participant Added",
      });
      addParticipantForm.reset();
    } else {
      toast({
        title: "Failed!",
        description: response.message,
      });
    }
  }

  const barangayOptions = barangayData;
  const bloodtypes = [
    "Unknown",
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "AB+",
    "AB",
    "AB-",
    "O+",
    "O",
    "O-",
  ];

  const professions = [
    { value: "Unemployed", label: "Unemployed" },
    { value: "Barangay - LGU", label: "Barangay - LGU" },
    { value: "Government Employee", label: "Government Employee" },
    { value: "Student", label: "Student" },
    { value: "Doctor", label: "Doctor" },
    { value: "Lawyer", label: "Lawyer" },
    { value: "Engineer", label: "Engineer" },
    { value: "Teacher", label: "Teacher" },
    { value: "Nurse", label: "Nurse" },
    { value: "Police", label: "Police" },
    { value: "Military", label: "Military" },
    { value: "Businessman", label: "Businessman" },
    { value: "Farmer", label: "Farmer" },
    { value: "Fisherman", label: "Fisherman" },
    { value: "Driver", label: "Driver" },
    { value: "Housewife", label: "Housewife" },
    { value: "Private Employee", label: "Private Employee" },
  ];

  const civilStatus = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Separated", label: "Separated" },
    { value: "Widowed", label: "Widowed" },
  ];

  return (
    <main>
      {/* <Button className="rounded-full w-12 h-12 border flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-blue-600 hover:text-white">
          <Plus className="w-4 h-4" />
        </Button>
      </div> */}
      <Sheet>
        <SheetTrigger className="w-full">
          <Button className="w-full">Register Participant</Button>
          {/* <Plus className="w-4 h-4" /> */}
        </SheetTrigger>

        <SheetContent className="max-w-[xxxxpx] sm:max-w-[650px] overflow-y-scroll">
          <SheetHeader>
            {/* <SheetTitle>Training Form</SheetTitle> */}
            <Form {...addParticipantForm}>
              <form
                onSubmit={addParticipantForm.handleSubmit(
                  onSubmitNewParticipant
                )}
              >
                <div className="grid grid-cols-2 gap-4 border rounded-2xl shadow-md p-4 my-3">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight col-span-2">
                    Personal Information
                  </h3>
                  <FormField
                    control={addParticipantForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          First Name
                          <span className="text-destructive"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addParticipantForm.control}
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
                    control={addParticipantForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Last Name
                          <span className="text-destructive"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addParticipantForm.control}
                    name="extensionName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extension Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Sr. Jr. III..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addParticipantForm.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mt-2">
                        <FormLabel>
                          Date of birth
                          <span className="text-destructive"> *</span>
                        </FormLabel>
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                variant="outline"
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addParticipantForm.control}
                    name="bloodtype"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bloodtype</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a bloodtype" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bloodtypes.map((bloodtype) => (
                              <SelectItem key={bloodtype} value={bloodtype}>
                                {bloodtype}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addParticipantForm.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Sex<span className="text-destructive"> *</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Sex" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addParticipantForm.control}
                    name="civilStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Civil Status
                          <span className="text-destructive"> *</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Civil Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {civilStatus.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}

                            {/* <SelectItem value="Married">Married</SelectItem>
                              <SelectItem value="Separated">
                                Separated
                              </SelectItem>
                              <SelectItem value="Widowed">Widowed</SelectItem> */}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addParticipantForm.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Profession</FormLabel>
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
                                  ? professions.find(
                                      (profession) =>
                                        profession.value === field.value
                                    )?.label
                                  : "Select Profession"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search Profession..." />
                              <CommandList>
                                <CommandEmpty>No language found.</CommandEmpty>
                                <CommandGroup>
                                  {professions.map((profession) => (
                                    <CommandItem
                                      value={profession.label}
                                      key={profession.value}
                                      onSelect={() => {
                                        addParticipantForm.setValue(
                                          "profession",
                                          profession.value
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          profession.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {profession.label}
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
                    control={addParticipantForm.control}
                    name="isLGBTQ"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Member of the LGBTQ+ Community</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addParticipantForm.control}
                    name="isPWD"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Person with Disability (PWD)</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 border rounded-2xl shadow-md p-4  mb-3">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight col-span-2">
                    Contact Information
                  </h3>
                  <FormField
                    control={addParticipantForm.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="09123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addParticipantForm.control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="johnthedoe@madeup.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 border rounded-2xl shadow-md p-4">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight col-span-2">
                    Address
                  </h3>
                  <div className="col-span-2">
                    <FormField
                      control={addParticipantForm.control}
                      name="PersonAddress.partialAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="99022 Gerlach Drives Suite 882"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={addParticipantForm.control}
                    name="PersonAddress.sitio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sitio</FormLabel>
                        <FormControl>
                          <Input placeholder="Zone-A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addParticipantForm.control}
                    name="PersonAddress.barangay"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-y-2">
                        <FormLabel>
                          Barangay
                          <span className="text-destructive"> *</span>
                        </FormLabel>
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
                                  ? barangayOptions.find(
                                      (barangay) =>
                                        barangay.value === field.value
                                    )?.label
                                  : "Select Barangay"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200] p-0">
                            <Command>
                              <CommandInput placeholder="Search Barangay..." />
                              <CommandList>
                                <CommandEmpty>No barangay found.</CommandEmpty>
                                <CommandGroup>
                                  {barangayOptions.map((barangay) => (
                                    <CommandItem
                                      value={barangay.label}
                                      key={barangay.value}
                                      onSelect={() => {
                                        addParticipantForm.setValue(
                                          "PersonAddress.barangay",
                                          barangay.value
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          barangay.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {barangay.label}
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
                <SheetClose>
                  <Button
                    className="w-full my-3"
                    type="submit"
                    disabled={isCanceled}
                  >
                    Submit
                  </Button>
                </SheetClose>
              </form>
            </Form>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </main>
  );
}
