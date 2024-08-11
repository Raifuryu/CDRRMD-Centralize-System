import * as z from "zod";

export const LoginSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  password: z.string().min(4, { message: "Password is required" }),
});

export const RegisterFormSchema = z.object({
  personId: z.number(),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  password: z.string().min(4, { message: "Password is required" }),
});

export const Person = z.object({
  id: z.number(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  extensionName: z.string(),
});

export const PersonPhoneNumberSchema = z.object({
  id: z.number(),
  personId: z.number(),
  number: z.string(),
  status: z.boolean(),
  statusId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const PersonEmailAddressSchema = z.object({
  id: z.number(),
  personId: z.number(),
  email: z.string(),
  status: z.boolean(),
  statusId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const DirectoryFormSchema = z.object({
  id: z.number(),
  firstName: z.string().min(1, { message: "First Name is required" }),
  middleName: z.string(),
  lastName: z.string().min(1, { message: "First Name is required" }),
  extensionName: z.string(),
  officeId: z.number().int({ message: "Office is required" }),
  phoneNumber: z.array(
    z.object({
      number: z.string(),
      status: z.boolean().default(true),
    })
  ),
  emailAddress: z.array(
    z.object({ email: z.string(), status: z.boolean().default(true) })
  ),
  tag: z.array(z.any()),
});

export const OfficeSchema = z.object({
  id: z.string(),
  name: z.string(),
  acronym: z.string(),
});

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const FormMethodSchema = z.enum(["POST", "PUT"]);
