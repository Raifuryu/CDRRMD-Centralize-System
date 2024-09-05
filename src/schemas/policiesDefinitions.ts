import * as z from "zod";

export const PolicySchema = z.object({
  title: z.string().min(1),
  dateApproved: z.date(),
  category: z.string().min(1),
  type: z.string().min(1),
  policyNumber: z.string().min(1),
});
