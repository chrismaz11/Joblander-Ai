import { type Resume, type InsertResume, type CoverLetter, type InsertCoverLetter, type Job, type User, type UpsertUser, type Template, type InsertTemplate, resumes, coverLetters, jobs, users, templates } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, or, and, like } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Resume operations
  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: string): Promise<Resume | undefined>;
  getAllResumes(): Promise<Resume[]>;
  getResumesByUserId(userId: string): Promise<Resume[]>;
  updateResume(id: string, resume: Partial<Resume>): Promise<Resume | undefined>;
  deleteResume(id: string): Promise<boolean>;
  
  // Cover letter operations
  createCoverLetter(coverLetter: InsertCoverLetter): Promise<CoverLetter>;
  getCoverLetter(id: string): Promise<CoverLetter | undefined>;
  getCoverLettersByResumeId(resumeId: string): Promise<CoverLetter[]>;
  
  // Job operations
  createJob(job: Omit<Job, "id">): Promise<Job>;
  getJob(id: string): Promise<Job | undefined>;
  getAllJobs(): Promise<Job[]>;
  searchJobs(query: string, location?: string): Promise<Job[]>;
  
  // Template operations
  createTemplate(template: InsertTemplate & { id?: string }): Promise<Template>;
  getTemplate(id: string): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private resumes: Map<string, Resume>;
  private coverLetters: Map<string, CoverLetter>;
  private jobs: Map<string, Job>;
  private templates: Map<string, Template>;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.coverLetters = new Map();
    this.jobs = new Map();
    this.templates = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = this.users.get(userData.id);
    const user: User = {
      ...existing,
      ...userData,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Resume operations
  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const resume: Resume = {
      id,
      userId: insertResume.userId || null,
      personalInfo: insertResume.personalInfo,
      experience: (insertResume.experience as any) || [],
      education: (insertResume.education as any) || [],
      skills: (insertResume.skills as any) || [],
      templateId: insertResume.templateId || null,
      pdfUrl: insertResume.pdfUrl || null,
      blockchainHash: insertResume.blockchainHash || null,
      verifiedAt: insertResume.verifiedAt || null,
      createdAt: new Date(),
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getAllResumes(): Promise<Resume[]> {
    return Array.from(this.resumes.values());
  }

  async getResumesByUserId(userId: string): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter((r) => r.userId === userId);
  }

  async updateResume(id: string, updates: Partial<Resume>): Promise<Resume | undefined> {
    const existing = this.resumes.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.resumes.set(id, updated);
    return updated;
  }

  async deleteResume(id: string): Promise<boolean> {
    return this.resumes.delete(id);
  }

  // Cover letter operations
  async createCoverLetter(insertCoverLetter: InsertCoverLetter): Promise<CoverLetter> {
    const id = randomUUID();
    const coverLetter: CoverLetter = {
      ...insertCoverLetter,
      resumeId: insertCoverLetter.resumeId || null,
      id,
      tone: insertCoverLetter.tone || "professional",
      variants: insertCoverLetter.variants || {},
      jobDescription: insertCoverLetter.jobDescription || null,
      createdAt: new Date(),
    };
    this.coverLetters.set(id, coverLetter);
    return coverLetter;
  }

  async getCoverLetter(id: string): Promise<CoverLetter | undefined> {
    return this.coverLetters.get(id);
  }

  async getCoverLettersByResumeId(resumeId: string): Promise<CoverLetter[]> {
    return Array.from(this.coverLetters.values()).filter(
      (cl) => cl.resumeId === resumeId
    );
  }

  // Job operations
  async createJob(jobData: Omit<Job, "id"> & { id?: string }): Promise<Job> {
    const id = (jobData as any).id || randomUUID();
    const job: Job = { ...jobData, id };
    this.jobs.set(id, job);
    return job;
  }

  async getJob(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async searchJobs(query: string, location?: string): Promise<Job[]> {
    const jobs = Array.from(this.jobs.values());
    return jobs.filter(job => {
      const matchesQuery = query
        ? job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.company.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesLocation = location
        ? job.location?.toLowerCase().includes(location.toLowerCase())
        : true;
      return matchesQuery && matchesLocation;
    });
  }

  // Template operations
  async createTemplate(templateData: InsertTemplate & { id?: string }): Promise<Template> {
    const id = templateData.id || randomUUID();
    const template: Template = {
      ...templateData,
      id,
      description: templateData.description || null,
      thumbnailUrl: templateData.thumbnailUrl || null,
      previewUrl: templateData.previewUrl || null,
      tags: (templateData.tags as any) || [],
      isPremium: templateData.isPremium || "false",
      createdAt: new Date(),
    };
    this.templates.set(id, template);
    return template;
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      (t) => t.category === category
    );
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Resume operations
  async createResume(insertResume: InsertResume): Promise<Resume> {
    const [resume] = await db
      .insert(resumes)
      .values({
        ...insertResume,
        userId: insertResume.userId || null,
        experience: insertResume.experience || [],
        education: insertResume.education || [],
        skills: insertResume.skills || [],
      })
      .returning();
    return resume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume || undefined;
  }

  async getAllResumes(): Promise<Resume[]> {
    return await db.select().from(resumes);
  }

  async getResumesByUserId(userId: string): Promise<Resume[]> {
    return await db.select().from(resumes).where(eq(resumes.userId, userId));
  }

  async updateResume(id: string, updates: Partial<Resume>): Promise<Resume | undefined> {
    const [updated] = await db
      .update(resumes)
      .set(updates)
      .where(eq(resumes.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteResume(id: string): Promise<boolean> {
    const result = await db.delete(resumes).where(eq(resumes.id, id)).returning();
    return result.length > 0;
  }

  // Cover letter operations
  async createCoverLetter(insertCoverLetter: InsertCoverLetter): Promise<CoverLetter> {
    const [coverLetter] = await db
      .insert(coverLetters)
      .values({
        ...insertCoverLetter,
        resumeId: insertCoverLetter.resumeId || null,
        tone: insertCoverLetter.tone || "professional",
        variants: insertCoverLetter.variants || {},
        jobDescription: insertCoverLetter.jobDescription || null,
      })
      .returning();
    return coverLetter;
  }

  async getCoverLetter(id: string): Promise<CoverLetter | undefined> {
    const [coverLetter] = await db.select().from(coverLetters).where(eq(coverLetters.id, id));
    return coverLetter || undefined;
  }

  async getCoverLettersByResumeId(resumeId: string): Promise<CoverLetter[]> {
    return await db.select().from(coverLetters).where(eq(coverLetters.resumeId, resumeId));
  }

  // Job operations
  async createJob(jobData: Omit<Job, "id"> & { id?: string }): Promise<Job> {
    const id = (jobData as any).id || randomUUID();
    const [job] = await db
      .insert(jobs)
      .values({ ...jobData, id })
      .returning();
    return job;
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs);
  }

  async searchJobs(query: string, location?: string): Promise<Job[]> {
    const conditions = [];
    
    if (query) {
      conditions.push(
        or(
          like(jobs.title, `%${query}%`),
          like(jobs.company, `%${query}%`)
        )
      );
    }
    
    if (location) {
      conditions.push(like(jobs.location, `%${location}%`));
    }

    if (conditions.length === 0) {
      return await db.select().from(jobs);
    }

    return await db.select().from(jobs).where(and(...conditions));
  }

  // Template operations
  async createTemplate(templateData: InsertTemplate & { id?: string }): Promise<Template> {
    const id = templateData.id || randomUUID();
    const [template] = await db
      .insert(templates)
      .values({ 
        ...templateData, 
        id,
        tags: templateData.tags || [],
      })
      .returning();
    return template;
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async getAllTemplates(): Promise<Template[]> {
    return await db.select().from(templates);
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return await db.select().from(templates).where(eq(templates.category, category));
  }
}

// Use DatabaseStorage by default, fallback to MemStorage for development
export const storage = new DatabaseStorage();
