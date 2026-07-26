import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    personal: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
      dob: z.string().datetime().optional(), // Expects ISO string
      phone: z.string().optional(),
    }).optional(),
    academic: z.object({
      school: z.string().optional(),
      educationLevel: z.string().optional(),
      board: z.string().optional(),
      currentClass: z.string().optional(),
      stream: z.string().optional(),
      percentage: z.number().min(0).max(100).optional(),
      graduationYear: z.number().optional(),
    }).optional(),
    career: z.object({
      dreamCareer: z.string().optional(),
      interestedDomains: z.array(z.string()).optional(),
      skills: z.array(z.string()).optional(),
      languages: z.array(z.string()).optional(),
      preferredWorkType: z.enum(['Remote', 'On-site', 'Hybrid']).optional(),
      preferredCities: z.array(z.string()).optional(),
    }).optional(),
    socioeconomic: z.object({
      incomeRange: z.string().optional(),
      scholarshipEligible: z.boolean().optional(),
      category: z.string().optional(),
      disability: z.string().optional(),
    }).optional(),
    preferences: z.object({
      notifications: z.boolean().optional(),
      privacy: z.enum(['Public', 'Private', 'Connections Only']).optional(),
      language: z.string().optional(),
      theme: z.enum(['Light', 'Dark', 'System']).optional(),
    }).optional(),
  }),
});
