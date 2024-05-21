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

export const PersonnelTrainingSchema = z.object({
  personnelId: z.number(),
  host: z.string(),
  name: z.string(),
  date: z.date(),
  hours: z.string(),
  status: z.enum(["Completion", "Attendance", "Participation"]),
  certificate: z.instanceof(File),
});
