import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

export const resumes = pgTable("resumes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  tier: text("tier"),
  personalInfo: jsonb("personal_info"),
  experience: jsonb("experience"),
  education: jsonb("education"),
  skills: jsonb("skills"),
  suggestions: jsonb("suggestions"),
  templateId: text("template_id"),
  status: text("status").default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const coverLetters = pgTable("cover_letters", {
  id: uuid("id").defaultRandom().primaryKey(),
  resumeId: uuid("resume_id").references(() => resumes.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id"),
  tier: text("tier"),
  companyName: text("company_name"),
  position: text("position"),
  tone: text("tone").default("professional"),
  content: text("content"),
  variants: jsonb("variants"),
  jobDescription: text("job_description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const userUsage = pgTable("user_usage", {
  userId: text("user_id").primaryKey(),
  resumesThisMonth: integer("resumes_this_month").default(0),
  coverLettersThisMonth: integer("cover_letters_this_month").default(0),
  lastUpdated: timestamp("last_updated", { withTimezone: true }),
});

export const jobs = pgTable("jobs", {
  id: text("id").primaryKey(),
  title: text("title"),
  company: text("company"),
  location: text("location"),
  city: text("city"),
  state: text("state"),
  remote: text("remote"),
  employmentType: text("employment_type"),
  salary: text("salary"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  description: text("description"),
  requirements: jsonb("requirements"),
  postedDate: timestamp("posted_date", { withTimezone: true }),
  jobUrl: text("job_url"),
  source: text("source"),
});

export const schema = {
  resumes,
  coverLetters,
  userUsage,
  jobs,
};
