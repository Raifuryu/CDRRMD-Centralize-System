import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "@/components/ui/use-toast";

const NewOfficeSchema = z.object({
  name: z.string().min(1, "No Input"),
  acronym: z.string().min(1, "No Input"),
  address: z.string().min(1, "No Input"),
});

export const AddOffice = () => {
  const router = useRouter();
  const newOfficeForm = useForm<z.infer<typeof NewOfficeSchema>>({
    resolver: zodResolver(NewOfficeSchema),
    defaultValues: {
      name: "",
      acronym: "",
      address: "",
    },
  });

  async function newOfficeOnSubmit(values: z.infer<typeof NewOfficeSchema>) {
    const res = await fetch("/api/office", {
      // next: { revalidate: 60 },
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "API-Key": process.env.DATA_API_KEY!,
      },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      toast({
        title: "Success!",
        description: "New Office Added",
      });
      newOfficeForm.reset();
      router.refresh();
    } else {
      toast({
        title: "Failed!",
        description:
          "The Server found your request confusing and isn't sure how to proceed",
      });
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-500 hover:bg-black">Add New Office</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...newOfficeForm}>
          <form
            onSubmit={newOfficeForm.handleSubmit(newOfficeOnSubmit)}
            className="space-y-8"
          >
            <DialogHeader>
              <DialogTitle>Add Office</DialogTitle>

              <FormField
                control={newOfficeForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Name</FormLabel>
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
                control={newOfficeForm.control}
                name="acronym"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Acronym</FormLabel>
                    <FormControl>
                      <Input placeholder="CDRRMD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newOfficeForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="GF. City Hall, Hayes St., Barangay 2, Cagayan de Oro City"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogHeader>
            <DialogFooter>
              <DialogClose>
                <Button type="submit">Add Office</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>

        {/* <DialogDescription>
        Make changes to your profile here. Click save when
        you're done.
      </DialogDescription> */}
      </DialogContent>
    </Dialog>
  );
};
