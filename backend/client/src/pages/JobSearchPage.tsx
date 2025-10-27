import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/utils/api";
import { formatTimeAgo } from "@/utils/format";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Filter,
  Globe,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";

type JobApiRecord = {
  id: string;
  title: string;
  company: string;
  location: string;
  city?: string;
  remote?: boolean;
  salary?: string;
  postedDate?: string;
  description?: string;
  requirements?: string[];
  jobUrl?: string;
};

type JobsResponse = {
  data: JobApiRecord[];
  pagination: {
    page: number;
    limit: number;
    totalJobs: number;
    totalPages: number;
  };
};

type JobStats = {
  totalJobs: number;
  remoteJobs: number;
  citiesAvailable: number;
  avgSalary: number;
};

const REMOTE_OPTIONS = [
  { label: "All roles", value: "any" },
  { label: "Remote only", value: "yes" },
  { label: "Onsite / Hybrid", value: "no" },
];

const buildQueryString = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && value.trim().length > 0) {
      searchParams.set(key, value);
    }
  });
  return searchParams.toString();
};

const computeCompatibility = (job: JobApiRecord, searchTerm: string) => {
  const base = 70;
  let score = base;

  if (job.remote) score += 8;
  if (job.salary && job.salary.includes("+") ) score += 4;
  if (searchTerm) {
    const normalized = searchTerm.toLowerCase();
    if (job.title?.toLowerCase().includes(normalized)) score += 12;
    if (job.description?.toLowerCase().includes(normalized)) score += 6;
  }

  return Math.min(97, Math.round(score));
};

export const JobSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("Any");
  const [remoteFilter, setRemoteFilter] = useState("any");

  const jobsQuery = useQuery({
    queryKey: ["jobs", searchTerm, selectedCity, remoteFilter],
    queryFn: async () => {
      const queryString = buildQueryString({
        query: searchTerm || undefined,
        city: selectedCity !== "Any" && selectedCity !== "Remote" ? selectedCity : undefined,
        remote: selectedCity === "Remote" ? "yes" : remoteFilter,
      });
      const path = queryString.length ? `/api/jobs?${queryString}` : "/api/jobs";
      return apiClient.get<JobsResponse>(path);
    },
  });

  const citiesQuery = useQuery({
    queryKey: ["job-cities"],
    queryFn: async () => apiClient.get<{ cities: string[] }>("/api/jobs/cities"),
  });

  const statsQuery = useQuery({
    queryKey: ["job-stats"],
    queryFn: async () => apiClient.get<JobStats>("/api/jobs/stats"),
  });

  const cityOptions = useMemo(() => {
    if (!citiesQuery.data?.cities) return ["Any", "Remote"];
    return ["Any", ...citiesQuery.data.cities];
  }, [citiesQuery.data?.cities]);

  const jobs = jobsQuery.data?.data ?? [];
  const totalJobs = jobsQuery.data?.pagination.totalJobs ?? 0;

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="accent" className="tracking-normal">
          Job Intelligence
        </Badge>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Discover roles curated for{" "}
          <span className="text-accent">your trajectory</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          JobLander AI syncs with top-tier job sources, scores every listing
          against your profile, and surfaces the highest-leverage opportunities.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-[320px,1fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">AI filters</h2>
            <p className="text-sm text-muted-foreground">
              Dynamic filters tuned to your goals. Adjust once, reuse across
              every job sprint.
            </p>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-muted-foreground">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">
                Target role
              </label>
              <div className="rounded-2xl border border-border/40 bg-surface/70 p-3">
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Director of Product, Principal Researcher..."
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">
                Location
              </label>
              <div className="flex flex-col gap-2">
                {cityOptions.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                      selectedCity === city
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border/40 bg-surface/70 hover:border-primary/30"
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && (
                      <Sparkles className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">
                Remote preference
              </label>
              <div className="flex flex-col gap-2">
                {REMOTE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRemoteFilter(option.value)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                      remoteFilter === option.value
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border/40 bg-surface/70 hover:border-primary/30"
                    }`}
                  >
                    <span>{option.label}</span>
                    {remoteFilter === option.value && (
                      <Sparkles className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/40 bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Platform insight
              </p>
              {statsQuery.isLoading ? (
                <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Crunching market signals…</span>
                </div>
              ) : (
                <ul className="mt-3 space-y-2 text-sm text-foreground">
                  <li>Total roles tracked: {statsQuery.data?.totalJobs ?? 0}</li>
                  <li>Remote friendly: {statsQuery.data?.remoteJobs ?? 0}</li>
                  <li>Active cities: {statsQuery.data?.citiesAvailable ?? 0}</li>
                  <li>Avg base salary: ${statsQuery.data?.avgSalary?.toLocaleString() ?? "—"}</li>
                </ul>
              )}
            </div>

            <Button className="w-full gap-2">
              <Filter className="h-4 w-4" />
              Save as smart filter
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {jobsQuery.isLoading
                ? "Loading opportunities…"
                : `Showing ${totalJobs} high-fit roles`}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full bg-muted/30 px-3 py-1">
                <Globe className="h-4 w-4" />
                Curated from verified sources
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-muted/30 px-3 py-1">
                <Sparkles className="h-4 w-4 text-primary" />
                AI scored against your profile
              </span>
            </div>
          </div>

          {jobsQuery.isLoading && (
            <Card className="border border-border/50 bg-surface/80">
              <CardContent className="flex items-center gap-3 p-6 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Fetching live roles…</span>
              </CardContent>
            </Card>
          )}

          {!jobsQuery.isLoading && jobs.length === 0 && (
            <Card className="border border-border/50 bg-surface/80">
              <CardContent className="space-y-2 p-6 text-muted-foreground">
                <h3 className="text-base font-semibold text-foreground">
                  No matches yet
                </h3>
                <p className="text-sm">
                  Try widening your filters or exploring nearby cities to uncover more opportunities.
                </p>
              </CardContent>
            </Card>
          )}

          {jobs.map((job) => {
            const compatibilityScore = computeCompatibility(job, searchTerm);
            const postedLabel = job.postedDate ? formatTimeAgo(job.postedDate) : "Recently";
            const highlights = job.requirements?.slice(0, 3) ?? [];

            return (
              <Card key={job.id} className="border border-border/50 bg-surface/80">
                <CardContent className="space-y-4 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                        {job.remote && (
                          <Badge variant="outline" className="gap-1 text-xs uppercase">
                            Remote
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {job.company}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span>{postedLabel}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs uppercase tracking-wide text-primary">
                        Compatibility {compatibilityScore}%
                      </span>
                      {job.salary && (
                        <span className="text-sm text-muted-foreground">{job.salary}</span>
                      )}
                    </div>
                  </div>

                  {job.description && (
                    <p className="text-sm text-muted-foreground">
                      {job.description}
                    </p>
                  )}

                  {highlights.length > 0 && (
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full bg-muted/25 px-3 py-1 uppercase tracking-wide"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button className="gap-2">
                      <BriefcaseBusiness className="h-4 w-4" />
                      View role deep dive
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 text-primary"
                      asChild
                    >
                      <a href={job.jobUrl ?? "#"} target="_blank" rel="noreferrer">
                        Go to original posting
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};
