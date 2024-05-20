import * as z from "zod";

export const PersonnelSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  extensionName: z.string(),
  division: z.string(),
  unit: z.string(),
  section: z.string(),
});

export const PersonnelInformationSchema = z.object({
  id: z.number(),
  employmentStatus: z.enum(["Permanent", "Casual", "Job Order"]),
  employmentDate: z.date(),
});
