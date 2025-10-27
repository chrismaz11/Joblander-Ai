import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { getDb } from "./db.js";
import {
  resumes as resumesTable,
  coverLetters as coverLettersTable,
  userUsage as usageTable,
} from "../drizzle/schema.js";

const memoryStore = {
  resumes: new Map(),
  coverLetters: new Map(),
  usage: new Map(),
};

const toISO = (value) =>
  value instanceof Date ? value.toISOString() : value ?? null;

const normalizeResume = (record) => {
  if (!record) return null;
  return {
    ...record,
    personalInfo: record.personalInfo ?? {},
    experience: Array.isArray(record.experience) ? record.experience : [],
    education: Array.isArray(record.education) ? record.education : [],
    skills: Array.isArray(record.skills) ? record.skills : [],
    suggestions: Array.isArray(record.suggestions) ? record.suggestions : [],
    createdAt: toISO(record.createdAt),
    updatedAt: toISO(record.updatedAt),
  };
};

const normalizeCoverLetter = (record) => {
  if (!record) return null;
  return {
    ...record,
    variants: record.variants ?? {},
    createdAt: toISO(record.createdAt),
    updatedAt: toISO(record.updatedAt),
  };
};

const normalizeUsage = (record) => {
  if (!record) {
    return {
      resumesThisMonth: 0,
      coverLettersThisMonth: 0,
      lastUpdated: null,
    };
  }
  return {
    ...record,
    lastUpdated: toISO(record.lastUpdated),
  };
};

const pickDefined = (source, keys) => {
  const result = {};
  keys.forEach((key) => {
    if (source[key] !== undefined) {
      result[key] = source[key];
    }
  });
  return result;
};

export async function createResume(payload) {
  const db = getDb();
  const baseRecord = {
    id: payload.id ?? randomUUID(),
    userId: payload.userId ?? null,
    tier: payload.tier ?? null,
    personalInfo: payload.personalInfo ?? {},
    experience: payload.experience ?? [],
    education: payload.education ?? [],
    skills: payload.skills ?? [],
    suggestions: payload.suggestions ?? [],
    templateId: payload.templateId ?? "modern",
    status: payload.status ?? "draft",
  };

  if (db) {
    const [record] = await db
      .insert(resumesTable)
      .values(baseRecord)
      .returning();
    return normalizeResume(record);
  }

  const timestamp = new Date().toISOString();
  const record = {
    ...baseRecord,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  memoryStore.resumes.set(record.id, record);
  return record;
}

export async function updateResume(id, updates) {
  const db = getDb();
  const allowed = [
    "personalInfo",
    "experience",
    "education",
    "skills",
    "suggestions",
    "templateId",
    "status",
    "tier",
  ];

  if (db) {
    const values = pickDefined(updates, allowed);
    if (Object.keys(values).length === 0) {
      const existing = await getResume(id);
      return existing;
    }
    values.updatedAt = new Date();
    const [record] = await db
      .update(resumesTable)
      .set(values)
      .where(eq(resumesTable.id, id))
      .returning();
    return normalizeResume(record);
  }

  const existing = memoryStore.resumes.get(id);
  if (!existing) return null;
  const updated = {
    ...existing,
    ...pickDefined(updates, allowed),
    updatedAt: new Date().toISOString(),
  };
  memoryStore.resumes.set(id, updated);
  return updated;
}

export async function getResume(id) {
  const db = getDb();
  if (db) {
    const [record] = await db
      .select()
      .from(resumesTable)
      .where(eq(resumesTable.id, id))
      .limit(1);
    return normalizeResume(record ?? null);
  }
  return memoryStore.resumes.get(id) ?? null;
}

export async function listResumes() {
  const db = getDb();
  if (db) {
    const records = await db
      .select()
      .from(resumesTable)
      .orderBy(desc(resumesTable.updatedAt));
    return records.map(normalizeResume);
  }
  return Array.from(memoryStore.resumes.values()).sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );
}

export async function createCoverLetter(payload) {
  const db = getDb();
  const baseRecord = {
    id: payload.id ?? randomUUID(),
    resumeId: payload.resumeId,
    userId: payload.userId ?? null,
    tier: payload.tier ?? null,
    companyName: payload.companyName,
    position: payload.position,
    tone: payload.tone ?? "professional",
    content: payload.content ?? "",
    variants: payload.variants ?? {},
    jobDescription: payload.jobDescription ?? "",
  };

  if (db) {
    const [record] = await db
      .insert(coverLettersTable)
      .values(baseRecord)
      .returning();
    return normalizeCoverLetter(record);
  }

  const timestamp = new Date().toISOString();
  const record = {
    ...baseRecord,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  memoryStore.coverLetters.set(record.id, record);
  return record;
}

export async function listCoverLetters(filter = {}) {
  const db = getDb();
  if (db) {
    let query = db.select().from(coverLettersTable).orderBy(
      desc(coverLettersTable.updatedAt),
    );
    if (filter.resumeId) {
      query = query.where(eq(coverLettersTable.resumeId, filter.resumeId));
    }
    const records = await query;
    return records.map(normalizeCoverLetter);
  }

  const values = Array.from(memoryStore.coverLetters.values());
  const collection = filter.resumeId
    ? values.filter((item) => item.resumeId === filter.resumeId)
    : values;
  return collection.sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );
}

export async function trackUsage(userId, action) {
  const db = getDb();
  if (db) {
    const existing = await getUsage(userId);
    const snapshot = {
      resumesThisMonth: existing.resumesThisMonth ?? 0,
      coverLettersThisMonth: existing.coverLettersThisMonth ?? 0,
      lastUpdated: new Date(),
    };
    if (action === "resume") snapshot.resumesThisMonth += 1;
    if (action === "coverLetter") snapshot.coverLettersThisMonth += 1;

    await db
      .insert(usageTable)
      .values({
        userId,
        ...snapshot,
      })
      .onConflictDoUpdate({
        target: usageTable.userId,
        set: snapshot,
      });

    return normalizeUsage(snapshot);
  }

  const snapshot =
    memoryStore.usage.get(userId) ?? {
      resumesThisMonth: 0,
      coverLettersThisMonth: 0,
      lastUpdated: new Date().toISOString(),
    };

  if (action === "resume") {
    snapshot.resumesThisMonth += 1;
  }
  if (action === "coverLetter") {
    snapshot.coverLettersThisMonth += 1;
  }
  snapshot.lastUpdated = new Date().toISOString();
  memoryStore.usage.set(userId, snapshot);
  return snapshot;
}

export async function getUsage(userId) {
  const db = getDb();
  if (db) {
    const [record] = await db
      .select()
      .from(usageTable)
      .where(eq(usageTable.userId, userId))
      .limit(1);
    return normalizeUsage(record ?? null);
  }

  return (
    memoryStore.usage.get(userId) ?? {
      resumesThisMonth: 0,
      coverLettersThisMonth: 0,
      lastUpdated: null,
    }
  );
}
