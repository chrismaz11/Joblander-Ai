import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  DollarSign,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";

import JobCompatibilityAnalyzer from "../components/jobs/JobCompatibilityAnalyzer";

export default function JobDetails() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const jobId = params.get("id");

  const { data: jobsResponse, isLoading } = useQuery({
    queryKey: [
      "/api/find-jobs",
      { page: 1, limit: 60, query: "", city: "", remote: "any", useSemanticRanking: false },
    ],
    enabled: Boolean(jobId),
  });

  const { data: resumes = [] } = useQuery({
    queryKey: ["/api/resumes"],
    initialData: [],
  });

  const [jobOverrides, setJobOverrides] = useState({});

  const job = useMemo(() => {
    const list = Array.isArray(jobsResponse?.data) ? jobsResponse.data : [];
    const raw = list.find((item) => item.id === jobId);
    if (!raw) return null;
    return {
      ...raw,
      ...jobOverrides[jobId as string],
      job_type: raw.job_type || raw.employmentType || "unknown",
      experience_level: raw.experience_level || raw.seniorityLevel || "unspecified",
      location: raw.location || raw.city || "Remote",
      salary_range: raw.salary_range || raw.salary,
    };
  }, [jobsResponse, jobOverrides, jobId]);

  const handleScoreCalculated = (score, summary) => {
    if (!jobId) return;
    setJobOverrides((prev) => ({
      ...prev,
      [jobId]: {
        ...(prev[jobId] || {}),
        aiMatchScore: score,
        match_explanation: summary,
      },
    }));
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!job) {
    return <div className="p-8">Job not found</div>;
  }

  const typeColors = {
    full_time: "bg-blue-100 text-blue-700",
    part_time: "bg-purple-100 text-purple-700",
    contract: "bg-amber-100 text-amber-700",
    internship: "bg-green-100 text-green-700",
    remote: "bg-pink-100 text-pink-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/jobs" className="inline-block">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                        <p className="text-lg text-gray-700 font-medium mb-3">{job.company}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={typeColors[job.job_type]}>
                            {job.job_type?.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </Badge>
                          {job.salary_range && (
                            <Badge variant="outline" className="gap-1">
                              <DollarSign className="w-3 h-3" />
                              {job.salary_range}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setJobOverrides((prev) => ({
                            ...prev,
                            [job.id]: { ...(prev[job.id] || {}), is_saved: !job.is_saved },
                          }))
                        }
                        className={job.is_saved ? "bg-blue-50 text-blue-600" : ""}
                      >
                        <Bookmark className={`w-4 h-4 ${job.is_saved ? 'fill-blue-600' : ''}`} />
                      </Button>
                    </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-lg mb-3">About the Role</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>

              {/* Requirements */}
              {job.requirements?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsibilities */}
              {job.responsibilities?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Responsibilities</h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setJobOverrides((prev) => ({
                      ...prev,
                      [job.id]: {
                        ...(prev[job.id] || {}),
                        applied: !job.applied,
                        application_status: !job.applied ? "applied" : "not_applied",
                        applied_date: !job.applied ? new Date().toISOString().split("T")[0] : null,
                      },
                    }))
                  }
                  className={`flex-1 ${job.applied ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
                >
                  <CheckCircle2 className={`w-4 h-4 mr-2 ${job.applied ? 'fill-green-600' : ''}`} />
                  {job.applied ? 'Applied' : 'Mark as Applied'}
                </Button>
                {job.application_url || job.jobUrl ? (
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => window.open(job.application_url || job.jobUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Compatibility Analysis */}
          {resumes.length > 0 && (
            <Card className="border-none shadow-lg">
              <CardHeader className="border-b">
                <CardTitle>AI Compatibility Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <JobCompatibilityAnalyzer
                  job={job}
                  userResume={resumes[0]}
                  onScoreCalculated={handleScoreCalculated}
                />
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
