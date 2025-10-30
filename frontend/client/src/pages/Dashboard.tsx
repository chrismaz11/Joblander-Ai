import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Briefcase,
  Clock,
  FileText,
  Mail,
  Plus,
  Sparkles,
  Star,
  Target,
  Zap,
  ArrowRight,
} from "lucide-react";
import type { Resume, CoverLetter } from "@shared/schema";

type CoverLetterSummary = CoverLetter & { resumeTitle?: string | null };

interface JobSummary {
  id: string;
  title: string;
  company: string;
  location?: string;
  aiMatchScore?: string | number;
  is_saved?: boolean;
  application_status?: string;
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const {
    data: resumes = [],
    isLoading: resumesLoading,
  } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
    enabled: isAuthenticated,
    initialData: [],
  });

  const {
    data: jobsResponse,
    isLoading: jobsLoading,
  } = useQuery({
    queryKey: [
      "/api/find-jobs",
      { page: 1, limit: 6, query: "", city: "", remote: "any", useSemanticRanking: false },
    ],
    enabled: isAuthenticated,
  });

  const {
    data: coverLetters = [],
    isLoading: coverLettersLoading,
  } = useQuery<CoverLetterSummary[]>({
    queryKey: ["/api/cover-letters"],
    enabled: isAuthenticated,
    initialData: [],
  });

  const jobs = useMemo(() => {
    const list = Array.isArray((jobsResponse as any)?.data) ? (jobsResponse as any).data : [];
    return list as JobSummary[];
  }, [jobsResponse]);

  const tierLimits = {
    free: { resumes: 3, aiActions: 10 },
    basic: { resumes: 10, aiActions: 50 },
    professional: { resumes: Infinity, aiActions: Infinity },
    enterprise: { resumes: Infinity, aiActions: Infinity },
  } as const;

  const currentTierKey = (user?.tier || "free").toLowerCase() as keyof typeof tierLimits;
  const limits = tierLimits[currentTierKey] ?? tierLimits.free;
  const resumeUsage =
    limits.resumes === Infinity ? 0 : Math.min(((resumes.length || 0) / limits.resumes) * 100, 100);
  const aiActionsUsed = (user as any)?.aiActionsUsed || 0;

  const stats = [
    {
      title: "Resumes",
      value: resumes.length,
      limit: limits.resumes === Infinity ? "∞" : limits.resumes,
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      trend: resumes.length ? "Keep polishing your story" : "Create your first resume",
      progress: limits.resumes === Infinity ? undefined : resumeUsage,
    },
    {
      title: "Job Matches",
      value: jobs.length,
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
      trend: "Fresh opportunities curated for you",
    },
    {
      title: "Cover Letters",
      value: coverLetters.length,
      icon: Mail,
      color: "from-amber-500 to-amber-600",
      trend: coverLetters.length ? "Tailored intros ready to send" : "Draft a standout intro",
    },
    {
      title: "AI Actions",
      value: aiActionsUsed,
      limit: limits.aiActions === Infinity ? "∞" : limits.aiActions,
      icon: Sparkles,
      color: "from-green-500 to-green-600",
      trend: "Harness AI for faster progress",
      progress: limits.aiActions === Infinity ? undefined : Math.min((aiActionsUsed / limits.aiActions) * 100, 100),
    },
  ];

  const recentActivity = useMemo(() => {
    const resumeActivity = resumes
      .map((resume) => ({
        id: `resume-${resume.id}`,
        label: resume.personalInfo.fullName || "Resume updated",
        activity_type: "Resume updated",
        created_at: resume.createdAt || new Date().toISOString(),
      }))
      .slice(0, 5);

    const coverLetterActivity = coverLetters
      .map((letter) => ({
        id: `cover-letter-${letter.id}`,
        label: `${letter.companyName} • ${letter.position}`,
        activity_type: "Cover letter generated",
        created_at: letter.createdAt || new Date().toISOString(),
      }))
      .slice(0, 5);

    return [...resumeActivity, ...coverLetterActivity]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6);
  }, [coverLetters, resumes]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-48 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton key={item} className="h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6" />
              <Badge className="bg-white/20 text-white border-white/30">
                {(user?.tier || "FREE").toUpperCase()} PLAN
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Hello, {user?.firstName || user?.email || "Job Seeker"}! 👋
            </h1>
            <p className="text-lg text-white/90 mb-6 max-w-2xl">
              Ready to land your dream job? Let's craft an outstanding resume, tailor your outreach, and track the best opportunities together.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/resume-builder">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 shadow-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Resume
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full transform translate-x-8 -translate-y-8`}
                />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      {stat.limit && <div className="text-lg text-gray-500">/ {stat.limit}</div>}
                    </div>
                    {stat.progress !== undefined && (
                      <div className="space-y-1">
                        <Progress value={stat.progress} className="h-2" />
                        <p className="text-xs text-gray-500">{Math.round(stat.progress)}% used</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">{stat.trend}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {limits.resumes !== Infinity && resumeUsage >= 80 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">You're almost at your limit!</h3>
                    <p className="text-gray-700 mb-4">
                      You've used {resumes.length} of {limits.resumes} included resumes. Upgrade for unlimited resumes, premium templates, and AI enhancements.
                    </p>
                    <Link href="/pricing">
                      <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                        <Zap className="w-4 h-4 mr-2" />
                        Upgrade Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Recent Resumes
                </CardTitle>
                <Link href="/resume-builder">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {resumesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No resumes yet</p>
                  <Link href="/resume-builder">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Resume
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.slice(0, 3).map((resume) => (
                    <Link key={resume.id} href="/resume-builder">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {resume.personalInfo.fullName || "Untitled"}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{resume.templateId || "modern"}</span>
                              <span>•</span>
                              <span>{resume.blockchainHash ? "verified" : "draft"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {resume.blockchainHash && <Star className="w-4 h-4 text-amber-500" />}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  Recommended Jobs
                </CardTitle>
                <Link href="/jobs">
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {jobsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No matches yet</p>
                  <Link href="/jobs">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Target className="w-4 h-4 mr-2" />
                      Explore Opportunities
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 3).map((job) => (
                    <Link key={job.id} href={`/jobs?id=${job.id}`}>
                      <div className="flex items-start justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-200 cursor-pointer">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{job.title}</p>
                          <p className="text-sm text-gray-600 truncate">{job.company}</p>
                          <p className="text-xs text-gray-500 mt-1">{job.location || "Remote"}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 ml-4">
                          {job.aiMatchScore && (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white whitespace-nowrap">
                              {job.aiMatchScore}% Match
                            </Badge>
                          )}
                          {job.application_status && job.application_status !== "not_applied" && (
                            <Badge variant="outline" className="text-xs whitespace-nowrap">
                              {job.application_status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Mail className="w-5 h-5 text-amber-600" />
                Cover Letters
              </CardTitle>
              <Link href="/cover-letter">
                <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {coverLettersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : coverLetters.length === 0 ? (
              <div className="text-center py-6 text-sm text-gray-600">
                No cover letters yet. Generate one tailored to your next application.
              </div>
            ) : (
              <div className="space-y-3">
                {coverLetters.slice(0, 3).map((letter) => (
                  <div key={letter.id} className="p-4 border border-gray-100 rounded-xl">
                    <p className="font-medium text-gray-900 truncate">
                      {letter.companyName} • {letter.position}
                    </p>
                    <p className="text-xs text-gray-500">
                      {letter.resumeTitle ? `Based on ${letter.resumeTitle}` : "AI generated"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {recentActivity.length > 0 && (
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="w-5 h-5 text-gray-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {activity.activity_type}: {activity.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
