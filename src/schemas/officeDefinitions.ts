import * as z from "zod";

export const officeSchema = z.object({
  name: z.string(),
  acronym: z.string(),
  organizationType: z.enum([
    "Government",
    "Government-Owned and Controlled Corporation",
    "Civil Society Organization",
  ]),
  contactNumber: z.string(),
  emailAddress: z.string(),
  fullAddress: z.string(),
  sitio: z.string(),
  barangayId: z.number(),
});

export const Office = z.object({
  id: z.number(),
  name: z.string(),
  acronym: z.string(),
  phoneNumber: z.object({
    id: z.number(),
    number: z.string(),
    statusId: z.number(),
  }),
  emailAddress: z.object({
    id: z.number(),
    email: z.string(),
    statusId: z.number(),
  }),
  officeTag: z.object({
    tag: z.object({
      id: z.number(),
      name: z.string(),
    }),
  }),
  status: z.enum(["Active", "Inactive"]),
});
