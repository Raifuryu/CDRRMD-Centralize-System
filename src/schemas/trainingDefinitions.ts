import * as z from "zod";

export const TrainingSchema = z.object({
  id: z.number(),
  trainer: z.string(),
  course: z.array(z.string()),
  venue: z.string(),
  date: z.object({ from: z.date(), to: z.date() }),
  pax: z.string(),
  remarks: z.string(),
  contactPerson: z.string(),
  contactNumber: z.string(),
  office: z.array(z.string()),
});

export const TrainingDocumentsSchema = z.object({
  after_activity_report: z.instanceof(File),
  documentation: z.any(),
});

export const CourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export const MultiSelectOptionsSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const ParticipantSchema = z.object({
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  extensionName: z.string(),
  nickname: z.string(),
  birthDate: z.date(),
  birthplace: z.string(),
  bloodtype: z.string(),
  gender: z.enum(["Male", "Female"]),
  civilStatus: z.enum(["Single", "Married", "Separated", "Widowed"]),
  isLGBTQ: z.boolean(),
  isPWD: z.boolean(),
  contactNumber: z.string(),
  emailAddress: z.string(),
  isUnemployed: z.boolean(),
  officeId: z.number(),
  occupation: z.string(),
});
