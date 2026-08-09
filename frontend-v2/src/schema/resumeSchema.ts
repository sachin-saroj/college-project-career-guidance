import { z } from "zod";

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").or(z.literal("")),
  phone: z.string().min(5, "Phone number is required").or(z.literal("")),
  location: z.string().optional(),
  linkedin: z.string().url("Invalid URL").or(z.literal("")).optional(),
  github: z.string().url("Invalid URL").or(z.literal("")).optional(),
  portfolio: z.string().url("Invalid URL").or(z.literal("")).optional(),
  summary: z.string().max(1000).optional(),
});

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree/Course is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  score: z.string().optional(), // CGPA or %
  description: z.string().optional(),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  techStack: z.array(z.string()).default([]),
  link: z.string().url("Invalid URL").or(z.literal("")).optional(),
  github: z.string().url("Invalid URL").or(z.literal("")).optional(),
});

export const CertificateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certificate name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().optional(),
  link: z.string().url("Invalid URL").or(z.literal("")).optional(),
});

export const ResumeSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Resume title is required"),
  template: z.enum(["modern", "professional", "minimal", "student", "creative"]),
  themeColor: z.string(),
  fontFamily: z.string(),
  lastModified: z.string(),
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationSchema),
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  skills: z.array(z.string()),
  certificates: z.array(CertificateSchema).default([]),
  languages: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  hobbies: z.array(z.string()).default([]),
});

export type ResumeType = z.infer<typeof ResumeSchema>;
export type PersonalInfoType = z.infer<typeof PersonalInfoSchema>;
export type EducationType = z.infer<typeof EducationSchema>;
export type ExperienceType = z.infer<typeof ExperienceSchema>;
export type ProjectType = z.infer<typeof ProjectSchema>;
export type CertificateType = z.infer<typeof CertificateSchema>;

export const defaultResume: ResumeType = {
  id: crypto.randomUUID(),
  title: "Untitled Resume",
  template: "modern",
  themeColor: "#6366f1", // brand primary
  fontFamily: "Inter, sans-serif",
  lastModified: new Date().toISOString(),
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    summary: "",
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certificates: [],
  languages: [],
  achievements: [],
  hobbies: [],
};
