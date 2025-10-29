import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  tier: varchar("tier").default("free"),
  stripeCustomerId: varchar("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  stripeSubscriptionId: varchar("stripe_subscription_id").unique(),
  status: varchar("status").notNull(),
  tier: varchar("tier").notNull(),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Usage tracking table
export const usageTracking = pgTable("usage_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: varchar("action").notNull(),
  count: text("count").default("1"),
  resetDate: timestamp("reset_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Resume schema
export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  personalInfo: jsonb("personal_info").$type<PersonalInfo>().notNull(),
  experience: jsonb("experience").$type<Experience[]>().default([]),
  education: jsonb("education").$type<Education[]>().default([]),
  skills: jsonb("skills").$type<string[]>().default([]),
  templateId: text("template_id"),
  blockchainHash: text("blockchain_hash"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cover letter schema
export const coverLetters = pgTable("cover_letters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resumeId: varchar("resume_id"),
  companyName: text("company_name").notNull(),
  position: text("position").notNull(),
  content: text("content").notNull(),
  tone: text("tone").default("professional"),
  variants: jsonb("variants").$type<CoverLetterVariants>().default({}),
  jobDescription: text("job_description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Template schema
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  previewUrl: text("preview_url"),
  tags: jsonb("tags").$type<string[]>().default([]),
  isPremium: text("is_premium").default("false"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Job listing schema
export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  description: text("description"),
  salary: text("salary"),
  postedDate: text("posted_date"),
  jobUrl: text("job_url"),
  aiMatchScore: text("ai_match_score"),
});

// Types for JSON fields
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  website?: string;
  summary?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface CoverLetterVariants {
  professional?: string;
  concise?: string;
  bold?: string;
}

// Insert schemas
export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
} as any);

export const insertCoverLetterSchema = createInsertSchema(coverLetters).omit({
  id: true,
  createdAt: true,
} as any);

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
} as any);

// Infer types
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;
export type InsertCoverLetter = z.infer<typeof insertCoverLetterSchema>;
export type CoverLetter = typeof coverLetters.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type UsageTracking = typeof usageTracking.$inferSelect;

// Form validation schemas
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  summary: z.string().optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(1, "Description is required"),
});

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
});

export const coverLetterFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  jobDescription: z.string().optional(),
});
