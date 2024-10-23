import * as z from "zod";

// Zod schema for Account
export const AccountSchema = z.object({
  id: z.number().optional(), // Automatically incremented
  personId: z.number(),
  username: z.string().min(1, "Username is required"), // Required string with minimum length
  password: z.string().min(1, "Password is required"), // Required string with minimum length
  type: z.string().default("User"), // Defaults to "User"
  createdAt: z.date().default(new Date()), // Defaults to current date
  updatedAt: z.date().optional(), // Automatically updated
  AccountModules: z.array(z.lazy(() => AccountModulesSchema)).optional(), // Array of AccountModules (can be empty)
});

// Zod schema for Person
export const PersonSchema = z.object({
  id: z.number().optional(), // Automatically incremented
  firstName: z.string().min(1, "First name is required").max(255),
  middleName: z.string().max(255).nullable().optional(), // Optional and nullable
  lastName: z.string().min(1, "Last name is required").max(255),
  extensionName: z.string().max(255).nullable().optional(), // Optional and nullable
  sex: z.string().nullable().optional(), // Optional and nullable
  officeId: z.number(), // Foreign key to Office
  birthDate: z.date().nullable().optional(), // Optional and nullable date
  civilStatus: z.string().default("Single"), // Defaults to "Single"
  bloodtype: z.string().default("Unknown"), // Defaults to "Unknown"
  isLGBTQ: z.boolean().default(false), // Defaults to false
  isPWD: z.boolean().default(false), // Defaults to false
  profession: z.string().default("Not Applicable"), // Defaults to "Not Applicable"
  createdAt: z.date().default(new Date()), // Defaults to current date
  updatedAt: z.date().optional(), // Automatically updated
  PersonAccount: z.array(z.lazy(() => AccountSchema)).optional(), // Array of Accounts (can be empty)
});

// Zod schema for AccountModules
export const AccountModulesSchema = z.object({
  id: z.number().optional(), // Automatically incremented
  accountId: z.number(), // Foreign key to Account
  moduleId: z.number(), // Foreign key to Modules
  access: z.boolean().default(false), // Defaults to false
  createdAt: z.date().default(new Date()), // Defaults to current date
  updatedAt: z.date().optional(), // Automatically updated
});

// Zod schema for Modules
export const ModulesSchema = z.object({
  id: z.number().optional(), // Automatically incremented
  name: z.string().min(1, "Module name is required"), // Required string
  description: z.string().min(1, "Description is required"), // Required string
  category: z.string().min(1, "Category is required"), // Required string
  moduleId: z.number(), // Foreign key to another module
  createdAt: z.date().default(new Date()), // Defaults to current date
  updatedAt: z.date().optional(), // Automatically updated
  AccountModules: z.array(z.lazy(() => AccountModulesSchema)).optional(), // Array of AccountModules (can be empty)
});
