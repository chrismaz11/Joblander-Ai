import fs from "fs";
import path from "path";
import { getDb } from "./db.js";
import { jobs as jobsTable } from "../drizzle/schema.js";
import { desc, like, and, gte, lte } from "drizzle-orm";

const sampleJobsPath = path.join(process.cwd(), "data", "sample-jobs.json");

const SALARY_RANGES = {
  "$0-50k": { min: 0, max: 50_000 },
  "$50-100k": { min: 50_000, max: 100_000 },
  "$100-150k": { min: 100_000, max: 150_000 },
  "$150k+": { min: 150_000, max: Number.MAX_VALUE },
};

let sampleJobsCache = null;

// Multiple job API integrations
async function fetchRealJobs(query, location) {
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  
  if (!rapidApiKey || rapidApiKey === "your_rapidapi_key") {
    console.log("[jobService] APIs not configured, using sample data");
    return null;
  }

  // Fetch from multiple sources in parallel
  const sources = [
    fetchJSearchJobs(query, location, rapidApiKey),
    fetchIndeedJobs(query, location, rapidApiKey),
    fetchLinkedInJobs(query, location, rapidApiKey)
  ];

  try {
    const results = await Promise.allSettled(sources);
    const allJobs = results
      .filter(result => result.status === 'fulfilled' && result.value)
      .flatMap(result => result.value);
    
    return allJobs.length > 0 ? allJobs : null;
  } catch (error) {
    console.error("[jobService] Error fetching from multiple sources:", error);
    return null;
  }
}

// JSearch API (current)
async function fetchJSearchJobs(query, location, apiKey) {

  try {
    const searchParams = new URLSearchParams({
      query: query || "software engineer",
      page: "1",
      num_pages: "1",
      date_posted: "all"
    });
    
    if (location) {
      searchParams.set("location", location);
    }

    const response = await fetch(`https://jsearch.p.rapidapi.com/search?${searchParams}`, {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const data = await response.json();
    
    // Transform API response to our format
    return data.data?.map(job => ({
      id: job.job_id || `api-${Date.now()}-${Math.random()}`,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city && job.job_state ? `${job.job_city}, ${job.job_state}` : job.job_country,
      city: job.job_city,
      state: job.job_state,
      remote: job.job_is_remote || false,
      employmentType: job.job_employment_type || "Full-time",
      salary: job.job_salary || undefined,
      salaryMin: job.job_min_salary,
      salaryMax: job.job_max_salary,
      description: job.job_description || "",
      requirements: job.job_highlights?.Qualifications || [],
      postedDate: job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc) : new Date(),
      jobUrl: job.job_apply_link,
      source: "jsearch"
    })) || [];

  } catch (error) {
    console.warn("[jobService] Real job API failed:", error.message);
    return null;
  }
}

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
    postedDate: job.postedDate ? new Date(job.postedDate) : new Date(),
    jobUrl: job.jobUrl,
    source: job.source || "sample"
  };
}

export async function getJobs(filters = {}) {
  const { query, location, salary, limit = 20 } = filters;

  // Try real API first
  const realJobs = await fetchRealJobs(query, location);
  if (realJobs && realJobs.length > 0) {
    console.log(`[jobService] Fetched ${realJobs.length} real jobs from API`);
    return {
      data: realJobs.slice(0, limit).map(normalizeJob),
      total: realJobs.length,
      source: "api"
    };
  }

  // Fallback to database + sample data
  const db = getDb();
  let dbJobs = [];

  if (db) {
    try {
      let dbQuery = db.select().from(jobsTable);
      
      const conditions = [];
      if (query) {
        conditions.push(like(jobsTable.title, `%${query}%`));
      }
      if (location) {
        conditions.push(like(jobsTable.location, `%${location}%`));
      }
      if (salary) {
        const range = parseSalaryRange(salary);
        if (range.min > 0) conditions.push(gte(jobsTable.salaryMin, range.min));
        if (range.max < Number.MAX_VALUE) conditions.push(lte(jobsTable.salaryMax, range.max));
      }

      if (conditions.length > 0) {
        dbQuery = dbQuery.where(and(...conditions));
      }

      dbJobs = await dbQuery.orderBy(desc(jobsTable.postedDate)).limit(limit);
    } catch (error) {
      console.warn("[jobService] Database query failed:", error);
    }
  }

  // Add sample jobs if needed
  const sampleJobs = readSampleJobs();
  let filteredSampleJobs = sampleJobs;

  if (query) {
    filteredSampleJobs = filteredSampleJobs.filter(job =>
      job.title?.toLowerCase().includes(query.toLowerCase()) ||
      job.company?.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (location) {
    filteredSampleJobs = filteredSampleJobs.filter(job =>
      job.location?.toLowerCase().includes(location.toLowerCase())
    );
  }

  const allJobs = [...dbJobs.map(normalizeJob), ...filteredSampleJobs.map(normalizeJob)]
    .filter(Boolean)
    .slice(0, limit);

  return {
    data: allJobs,
    total: allJobs.length,
    source: dbJobs.length > 0 ? "database" : "sample"
  };
}

export async function getJobCities() {
  const db = getDb();
  if (!db) {
    return { data: ["San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Remote"] };
  }

  try {
    const cities = await db.selectDistinct({ city: jobsTable.city }).from(jobsTable);
    return { data: cities.map(c => c.city).filter(Boolean) };
  } catch (error) {
    console.warn("[jobService] Failed to fetch cities:", error);
    return { data: [] };
  }
}

export async function getJobStats() {
  const db = getDb();
  
  try {
    const jobs = await getJobs({ limit: 1000 });
    const totalJobs = jobs.data.length;
    
    const remoteJobs = jobs.data.filter(job => job.remote).length;
    const recentJobs = jobs.data.filter(job => {
      const daysSincePosted = (Date.now() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24);
      return daysSincePosted <= 7;
    }).length;

    return {
      data: {
        total: totalJobs,
        remote: remoteJobs,
        recent: recentJobs,
        companies: [...new Set(jobs.data.map(job => job.company))].length
      }
    };
  } catch (error) {
    console.warn("[jobService] Failed to get stats:", error);
    return {
      data: { total: 0, remote: 0, recent: 0, companies: 0 }
    };
  }
}
