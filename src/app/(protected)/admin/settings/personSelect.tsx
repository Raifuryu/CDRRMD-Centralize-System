"use client";

import React, { useState } from "react";
import ModuleSwitch from "./moduleSwitch";
import { PersonSchema } from "@/schemas/accountDefinitions";
import { z } from "zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Person = z.infer<typeof PersonSchema>;

function createMultiSelectOptions(persons: z.infer<typeof PersonSchema>[]) {
  return persons.map((person) => ({
    key: String(person.id), // Add a unique key prop
    value: String(person.id), // Convert the `id` to a string for the `value` field
    label: `${person.firstName} ${
      person.middleName ? person.middleName + " " : ""
    }${person.lastName}${
      person.extensionName ? " " + person.extensionName : ""
    }`.trim(),
  }));
}

const personSelect = ({ personData }: { personData: Person[] }) => {
  const [personId, setPersonId] = useState("");
  const [open, setOpen] = React.useState(false);
  const selectOptions = createMultiSelectOptions(personData);
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between",
              !personId && "text-muted-foreground"
            )}
          >
            {personId
              ? selectOptions.find((option) => option.value === personId)?.label
              : "Select person"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200] p-0">
          <Command>
            <CommandInput placeholder="Search Office..." />
            <CommandList>
              <CommandEmpty>No person found</CommandEmpty>
              <CommandGroup>
                {selectOptions.map((option) => (
                  <CommandItem
                    value={option.label}
                    key={option.value}
                    onSelect={(currentValue) => {
                      setPersonId(
                        currentValue === personId ? "" : option.value
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        option.value === personId ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <ModuleSwitch personId={parseInt(personId)} />
    </>
  );
};

export default personSelect;
