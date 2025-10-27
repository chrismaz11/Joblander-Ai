import type { Job } from "@shared/schema";
import { readFileSync } from "fs";
import path from "path";

// Load sample jobs data
const sampleJobsPath = path.join(process.cwd(), "server/data/sample-jobs.json");
let sampleJobs: any = null;

try {
  const data = readFileSync(sampleJobsPath, 'utf-8');
  sampleJobs = JSON.parse(data);
} catch (error) {
  console.warn("Could not load sample jobs data:", error);
}

// Job search filters interface
export interface JobSearchFilters {
  query?: string;
  location?: string;
  city?: string;
  remote?: "yes" | "no" | "any";
  employmentType?: string[];
  salaryRange?: string;
  page?: number;
  limit?: number;
}

// Parse salary range string into min/max values
function parseSalaryRange(range: string): { min: number; max: number } {
  switch (range) {
    case "$0-50k":
      return { min: 0, max: 50000 };
    case "$50-100k":
      return { min: 50000, max: 100000 };
    case "$100-150k":
      return { min: 100000, max: 150000 };
    case "$150k+":
      return { min: 150000, max: Number.MAX_VALUE };
    default:
      return { min: 0, max: Number.MAX_VALUE };
  }
}

// Apply filters to job listings
export function filterJobs(jobs: any[], filters: JobSearchFilters): any[] {
  let filteredJobs = [...jobs];

  // Filter by query (keywords in title or description)
  if (filters.query && filters.query.trim()) {
    const query = filters.query.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.title?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.requirements?.some((req: string) => req.toLowerCase().includes(query))
    );
  }

  // Filter by city
  if (filters.city && filters.city.trim() && filters.city !== "Any") {
    const city = filters.city.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.city?.toLowerCase().includes(city) ||
      job.location?.toLowerCase().includes(city) ||
      (city === "remote" && job.remote === true)
    );
  }

  // Filter by location (broader than city)
  if (filters.location && filters.location.trim() && !filters.city) {
    const location = filters.location.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.location?.toLowerCase().includes(location) ||
      job.city?.toLowerCase().includes(location) ||
      job.state?.toLowerCase().includes(location)
    );
  }

  // Filter by remote status
  if (filters.remote && filters.remote !== "any") {
    filteredJobs = filteredJobs.filter(job => 
      filters.remote === "yes" ? job.remote === true : job.remote === false
    );
  }

  // Filter by employment type
  if (filters.employmentType && filters.employmentType.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      filters.employmentType!.includes(job.employmentType)
    );
  }

  // Filter by salary range
  if (filters.salaryRange && filters.salaryRange !== "any") {
    const { min, max } = parseSalaryRange(filters.salaryRange);
    filteredJobs = filteredJobs.filter(job => {
      const jobMin = job.salaryMin || 0;
      const jobMax = job.salaryMax || Number.MAX_VALUE;
      return (jobMin >= min && jobMin <= max) || (jobMax >= min && jobMax <= max);
    });
  }

  return filteredJobs;
}

// Paginate results
export function paginateJobs(jobs: any[], page: number = 1, limit: number = 10) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedJobs = jobs.slice(startIndex, endIndex);
  
  return {
    data: paginatedJobs,
    pagination: {
      page,
      limit,
      totalJobs: jobs.length,
      totalPages: Math.ceil(jobs.length / limit),
      hasNext: endIndex < jobs.length,
      hasPrev: page > 1
    }
  };
}

// Search jobs with fallback to sample data
export async function searchJobs(filters: JobSearchFilters): Promise<any> {
  try {
    // Try to use JSearch API if configured
    if (process.env.JSEARCH_API_KEY && filters.query && !filters.city) {
      const params = new URLSearchParams({
        query: filters.query,
        ...(filters.location && { location: filters.location }),
        num_pages: "1",
      });

      const response = await fetch(
        `https://jsearch.p.rapidapi.com/search?${params}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": process.env.JSEARCH_API_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Transform JSearch data to our Job schema
        const transformedJobs = data.data?.map((job: any) => ({
          id: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          location: `${job.job_city || ""}, ${job.job_state || ""}`.trim(),
          city: job.job_city,
          state: job.job_state,
          country: job.job_country,
          employmentType: job.job_employment_type,
          remote: job.job_is_remote,
          salary: job.job_salary_currency ? 
            `${job.job_salary_currency} ${job.job_min_salary || 0}-${job.job_max_salary || 0}` : 
            undefined,
          salaryMin: job.job_min_salary,
          salaryMax: job.job_max_salary,
          description: job.job_description,
          requirements: job.job_required_skills || [],
          postedDate: job.job_posted_at_datetime_utc,
          jobUrl: job.job_apply_link,
        })) || [];

        // Apply filters and pagination
        const filteredJobs = filterJobs(transformedJobs, filters);
        return paginateJobs(filteredJobs, filters.page, filters.limit);
      }
    }
  } catch (error) {
    console.warn("JSearch API error, falling back to sample data:", error);
  }

  // Fall back to sample data
  if (!sampleJobs || !sampleJobs.jobs) {
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        totalJobs: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    };
  }

  // Apply filters to sample jobs
  const filteredJobs = filterJobs(sampleJobs.jobs, filters);
  
  // Return paginated results
  return paginateJobs(filteredJobs, filters.page || 1, filters.limit || 10);
}

// Get unique cities from sample jobs
export function getAvailableCities(): string[] {
  if (!sampleJobs || !sampleJobs.jobs) {
    return [];
  }

  const cities = new Set<string>();
  sampleJobs.jobs.forEach((job: any) => {
    if (job.city && job.city !== "Remote") {
      cities.add(job.city);
    }
  });

  // Add "Remote" as an option
  cities.add("Remote");

  return Array.from(cities).sort();
}

// Get job statistics
export function getJobStatistics() {
  if (!sampleJobs || !sampleJobs.jobs) {
    return {
      totalJobs: 0,
      citiesAvailable: 0,
      remoteJobs: 0,
      avgSalary: 0
    };
  }

  const jobs = sampleJobs.jobs;
  const remoteJobs = jobs.filter((job: any) => job.remote === true).length;
  const cities = new Set(jobs.map((job: any) => job.city).filter((city: any) => city));
  
  let totalSalary = 0;
  let salaryCount = 0;
  
  jobs.forEach((job: any) => {
    if (job.salaryMin && job.salaryMax) {
      totalSalary += (job.salaryMin + job.salaryMax) / 2;
      salaryCount++;
    }
  });

  return {
    totalJobs: jobs.length,
    citiesAvailable: cities.size,
    remoteJobs,
    avgSalary: salaryCount > 0 ? Math.round(totalSalary / salaryCount) : 0
  };
}
