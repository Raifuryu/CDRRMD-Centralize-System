import * as z from "zod";
import { officeSchema } from "./officeDefinitions";

export const TrainingSchema = z.object({
  id: z.number(),
  trainer: z.string(),
  course: z.array(z.string()),
  venue: z.string(),
  date: z.object({ from: z.date(), to: z.date() }),
  pax: z.string(),
  remarks: z.string(),
  requestingOffice: officeSchema,
  contactPerson: z.string(),
  contactNumber: z.string(),
  office: z.array(z.string()),
  batchNumber: z.number(),
  trainingSerial: z.string(),
});

export const TrainingDocumentsSchema = z.object({
  after_activity_report: z.instanceof(File).optional(),
  documentation: z.array(z.instanceof(File)).optional(),
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
  trainingId: z.string(),
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  extensionName: z.string().optional(),
  birthDate: z.date(),
  bloodtype: z.string().optional(),
  sex: z.string(),
  civilStatus: z.string(),
  isLGBTQ: z.boolean().default(false),
  isPWD: z.boolean().default(false),
  contactNumber: z.string().optional(),
  emailAddress: z.string().optional(),
  officeId: z.number().optional(),
  profession: z.string().default("Not Applicable"),
  PersonAddress: z.object({
    partialAddress: z.string().optional(),
    sitio: z.string().optional(),
    barangay: z.string(),
  }),
});

export const multipleParticipantsSchema = z.object({
  trainingId: z.string(),
  participantIds: z.array(z.string()),
});

export const multiSelectParticipantOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});
