import * as z from "zod";

export const barangaySchema = z.object({
  cityId: z.number(),
  name: z.string(),
});

export const barangayOptionsSchema = z.object({
  value: z.string(),
  label: z.string(),
});
