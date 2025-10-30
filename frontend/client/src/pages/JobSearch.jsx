import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Briefcase } from "lucide-react";

import JobFilters from "../components/jobs/JobFilters";
import JobCard from "../components/jobs/JobCard";

export default function JobSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    job_type: "all",
    experience_level: "all",
    location: ""
  });

  const { data: jobsResponse, isLoading } = useQuery({
    queryKey: [
      "/api/find-jobs",
      { page: 1, limit: 40, query: "", city: "", remote: "any", useSemanticRanking: false },
    ],
    initialData: { data: [] },
  });

  const [jobOverrides, setJobOverrides] = useState({});

  const jobs = useMemo(() => {
    const list = Array.isArray(jobsResponse?.data) ? jobsResponse.data : [];
    return list.map((job) => ({
      ...job,
      ...jobOverrides[job.id],
      job_type: job.job_type || job.employmentType || "unknown",
      experience_level: job.experience_level || job.seniorityLevel || "unspecified",
      location: job.location || job.city || "Remote",
    }));
  }, [jobsResponse, jobOverrides]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filters.job_type === "all" || job.job_type === filters.job_type;
    const matchesLevel = filters.experience_level === "all" || job.experience_level === filters.experience_level;
    const matchesLocation = !filters.location || 
      job.location?.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesType && matchesLevel && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Search</h1>
          <p className="text-gray-600">
            Discover opportunities that match your skills and career goals
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-4 border-none shadow-lg">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by job title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </Card>

        {/* Filters */}
        {showFilters && (
          <JobFilters filters={filters} setFilters={setFilters} />
        )}

        {/* Job Listings */}
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'}
          </p>
          
          {filteredJobs.length === 0 ? (
            <Card className="p-12 text-center border-none shadow-lg">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onToggleSave={(saved) =>
                    setJobOverrides((prev) => ({
                      ...prev,
                      [job.id]: { ...(prev[job.id] || {}), is_saved: saved },
                    }))
                  }
                  onToggleApplied={(applied) =>
                    setJobOverrides((prev) => ({
                      ...prev,
                      [job.id]: {
                        ...(prev[job.id] || {}),
                        applied,
                        application_status: applied ? "applied" : "not_applied",
                      },
                    }))
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
