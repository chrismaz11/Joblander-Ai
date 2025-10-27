import fs from "fs";
import path from "path";
import { getDb } from "./db.js";
import { jobs as jobsTable } from "../drizzle/schema.js";
import { desc } from "drizzle-orm";

const sampleJobsPath = path.join(process.cwd(), "data", "sample-jobs.json");

const SALARY_RANGES = {
  "$0-50k": { min: 0, max: 50_000 },
  "$50-100k": { min: 50_000, max: 100_000 },
  "$100-150k": { min: 100_000, max: 150_000 },
  "$150k+": { min: 150_000, max: Number.MAX_VALUE },
};

let sampleJobsCache = null;
let cachedJobs = null;
let loadingPromise = null;
let seedingAttempted = false;

function readSampleJobs() {
  if (sampleJobsCache) return sampleJobsCache;
  try {
    const raw = fs.readFileSync(sampleJobsPath, "utf-8");
    const parsed = JSON.parse(raw);
    sampleJobsCache = parsed.jobs ?? [];
  } catch (error) {
    console.warn("[jobService] Could not load sample jobs:", error);
    sampleJobsCache = [];
  }
  return sampleJobsCache;
}

const parseSalaryRange = (range) => SALARY_RANGES[range] ?? { min: 0, max: Number.MAX_VALUE };

function normalizeJob(job) {
  if (!job) return null;
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    city: job.city,
    state: job.state,
    remote: job.remote === true || job.remote === "yes",
    employmentType: job.employmentType ?? "Full-time",
    salary: job.salary ?? undefined,
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    description: job.description ?? "",
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    postedDate:
      job.postedDate instanceof Date
        ? job.postedDate.toISOString()
        : typeof job.postedDate === "string"
        ? job.postedDate
        : undefined,
    jobUrl: job.jobUrl ?? job.url ?? undefined,
  };
}

async function seedSampleJobs() {
  if (seedingAttempted) return;
  seedingAttempted = true;
  const db = getDb();
  if (!db) return;

  const jobs = readSampleJobs();
  if (!jobs.length) return;

  try {
    await db
      .insert(jobsTable)
      .values(
        jobs.map((job) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          city: job.city,
          state: job.state,
          remote: job.remote ? "yes" : "no",
          employmentType: job.employmentType ?? "Full-time",
          salary: job.salary ?? null,
          salaryMin: job.salaryMin ?? null,
          salaryMax: job.salaryMax ?? null,
          description: job.description ?? null,
          requirements: job.requirements ?? [],
          postedDate: job.postedDate ? new Date(job.postedDate) : null,
          jobUrl: job.jobUrl ?? null,
          source: "sample",
        }))
      )
      .onConflictDoNothing({ target: jobsTable.id });
  } catch (error) {
    console.warn("[jobService] Unable to seed jobs table:", error);
  }
}

async function loadJobs() {
  if (cachedJobs) return cachedJobs;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const db = getDb();
    if (db) {
      try {
        const records = await db
          .select()
          .from(jobsTable)
          .orderBy(desc(jobsTable.postedDate));
        if (records.length) {
          cachedJobs = records.map(normalizeJob).filter(Boolean);
          return cachedJobs;
        }
      } catch (error) {
        console.warn("[jobService] Failed to read jobs from database:", error);
      }
    }

    cachedJobs = readSampleJobs().map(normalizeJob).filter(Boolean);
    return cachedJobs;
  })();

  const data = await loadingPromise;
  loadingPromise = null;
  return data;
}

seedSampleJobs();

function filterJobs(jobs, filters) {
  let results = [...jobs];

  if (filters.query) {
    const query = filters.query.toLowerCase();
    results = results.filter((job) =>
      [job.title, job.description, job.company, ...(job.requirements ?? [])]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }

  if (filters.city && filters.city !== "Any") {
    const city = filters.city.toLowerCase();
    results = results.filter((job) => {
      if (city === "remote") return job.remote === true;
      return (
        job.city?.toLowerCase().includes(city) ||
        job.location?.toLowerCase().includes(city)
      );
    });
  } else if (filters.location) {
    const location = filters.location.toLowerCase();
    results = results.filter((job) =>
      [job.location, job.city, job.state]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(location)),
    );
  }

  if (filters.remote && filters.remote !== "any") {
    results = results.filter((job) =>
      filters.remote === "yes" ? job.remote === true : job.remote === false,
    );
  }

  if (filters.employmentType?.length) {
    results = results.filter((job) =>
      filters.employmentType.includes(job.employmentType),
    );
  }

  if (filters.salaryRange && filters.salaryRange !== "any") {
    const { min, max } = parseSalaryRange(filters.salaryRange);
    results = results.filter((job) => {
      const jobMin = job.salaryMin ?? 0;
      const jobMax = job.salaryMax ?? Number.MAX_VALUE;
      return (jobMin >= min && jobMin <= max) || (jobMax >= min && jobMax <= max);
    });
  }

  return results;
}

function paginate(jobs, page = 1, limit = 10) {
  const normalizedPage = Math.max(1, page);
  const normalizedLimit = Math.max(1, Math.min(50, limit));
  const start = (normalizedPage - 1) * normalizedLimit;
  const data = jobs.slice(start, start + normalizedLimit);
  return {
    data,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      totalJobs: jobs.length,
      totalPages: Math.ceil(jobs.length / normalizedLimit),
      hasNext: start + normalizedLimit < jobs.length,
      hasPrev: normalizedPage > 1,
    },
  };
}

export async function getJobs(filters = {}) {
  const jobs = await loadJobs();
  const filtered = filterJobs(jobs, filters);
  return paginate(filtered, filters.page ?? 1, filters.limit ?? 10);
}

export async function getJobStats() {
  const jobs = await loadJobs();
  const remoteCount = jobs.filter((job) => job.remote === true).length;
  const cities = new Set(
    jobs
      .map((job) => job.city)
      .filter((city) => city && city.toLowerCase() !== "remote"),
  );
  const salaryValues = jobs
    .map((job) => job.salaryMin)
    .filter((value) => typeof value === "number");
  const avgSalary =
    salaryValues.reduce((sum, value) => sum + value, 0) /
    (salaryValues.length || 1);

  return {
    totalJobs: jobs.length,
    remoteJobs: remoteCount,
    citiesAvailable: cities.size,
    avgSalary: Math.round(avgSalary || 0),
  };
}

export async function getJobCities(search) {
  const jobs = await loadJobs();
  const cities = new Set(
    jobs
      .map((job) => job.city)
      .filter((city) => city && city.toLowerCase() !== "remote"),
  );
  const list = Array.from(cities).sort();
  if (!search) {
    return ["Remote", ...list];
  }
  const query = search.toLowerCase();
  return [
    "Remote",
    ...list.filter((city) => city.toLowerCase().includes(query)),
  ];
}
