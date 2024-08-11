import * as z from "zod";

const AddressSchema = z.object({
  municipality: z
    .string()
    .refine((value) => value != "", "Municipality is required"),
  city: z.string().refine((value) => value != "", "City is required"),
  barangay: z.string().refine((value) => value != "", "Barangay is required"),
  street: z.string(),
});

export const PersonSchema = z.object({
  firstName: z
    .string()
    .refine((value) => value != "", "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().refine((value) => value != "", "Last Name is required"),
  extensionName: z.string().optional(),
  gender: z.enum(["Male", "Female"]),
  officeId: z.number(),
});

export const PersonnelSchema = z.object({
  firstName: z
    .string()
    .refine((value) => value != "", "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().refine((value) => value != "", "Last Name is required"),
  extensionName: z.string().optional(),
  dateOfBirth: z.date().refine((date) => date <= new Date(), {
    message: "Date of birth cannot be in the future",
  }),
  placeOfBirth: z
    .string()
    .refine((value) => value != "", "Place of birth is required"),
  sex: z.enum(["Male", "Female"], { message: "Select a Sex" }),
  civilStatus: z.enum(
    [
      "Single",
      "Married",
      "Separated",
      "Widowed",
      "Annulled",
      "Civil Partnership",
    ],
    { message: "Select a Civil Status" }
  ),
  height: z.number(),
  weight: z.number(),
  bloodType: z.enum(
    [
      "A+",
      "A",
      "-A",
      "+B",
      "B",
      "-B",
      "AB+",
      "AB",
      "AB-",
      "O+",
      "O",
      "O-",
      "unkown",
    ],
    { message: "Select a Blood Type" }
  ),
  gsis: z.string().optional(),
  pagibig: z.string().refine((value) => value != "", "Pag-ibig is required"),
  philhealth: z
    .string()
    .refine((value) => value != "", "Philhealth is required"),
  sss: z.string().optional(),
  tin: z.string().refine((value) => value != "", "TIN is required"),
  agencyEmployeeNumber: z.string().optional(),
  residentialAddress: AddressSchema,
  permanentAddress: AddressSchema,
  emailAddress: z.array(z.string().email()),
  number: z.array(
    z.string().regex(/^\d+$/, "Phone number should only contain digits")
  ),
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
