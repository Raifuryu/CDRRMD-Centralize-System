import { addDays } from "date-fns";
import * as z from "zod";

export const trainingSchema = z.object({
  course: z.array(z.string()),
  venue: z.string(),
  date: z
    .object({ from: z.date(), to: z.date() })
    .refine(
      (data) => data.from > addDays(new Date(), -1),
      "Start date must be in the future"
    ),
  remarks: z.string(),
  contactPerson: z.string(),
  contactNumber: z.string(),
  office: z.array(z.string()),
});

export const participantSchema = z.object({
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
