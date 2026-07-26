import { z } from 'zod';

export const personalInfoSchema = z.object({
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

export const academicInfoSchema = z.object({
  highestQualification: z.string().min(1, 'Highest qualification is required'),
  institution: z.string().min(1, 'Institution is required'),
  boardOrUniversity: z.string().optional(),
  graduationYear: z.coerce.number().min(1950, 'Invalid year').max(new Date().getFullYear() + 5).optional(),
  percentageOrCgpa: z.string().optional(),
  subjects: z.array(z.string()).optional(),
});

export const careerInterestsSchema = z.object({
  primaryFields: z.array(z.string()).min(1, 'At least one primary field is required'),
  preferredRoles: z.array(z.string()).optional(),
  openToRelocation: z.boolean().default(false),
  expectedSalaryRange: z.string().optional(),
});

export const socioeconomicSchema = z.object({
  annualFamilyIncome: z.string().optional(),
  firstGenerationLearner: z.boolean().default(false),
  disabilityStatus: z.string().optional(),
});

export const updateProfileSchema = z.object({
  personal: personalInfoSchema.optional(),
  academicInfo: academicInfoSchema.optional(),
  careerInterests: careerInterestsSchema.optional(),
  socioeconomicDetails: socioeconomicSchema.optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
