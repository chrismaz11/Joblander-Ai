import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Mail, Briefcase } from "lucide-react";

import StatsOverview from "../components/admin/StatsOverview";
import UsersTable from "../components/admin/UsersTable";

export default function AdminPanel() {
  const { data: resumes = [], isLoading: resumesLoading } = useQuery({
    queryKey: ["/api/resumes"],
    initialData: [],
  });

  const { data: jobsData } = useQuery({
    queryKey: [
      "/api/find-jobs",
      { page: 1, limit: 20, query: "", city: "", remote: "any", useSemanticRanking: false },
    ],
  });

  const jobs = Array.isArray(jobsData?.data) ? jobsData.data : [];
  const coverLetters = [];
  const users = [];
  const usersLoading = false;

  const stats = [
    { title: "Total Users", value: users.length, icon: Users, color: "from-blue-500 to-blue-600" },
    { title: "Total Resumes", value: resumes?.length || 0, icon: FileText, color: "from-purple-500 to-purple-600" },
    { title: "Total Jobs", value: jobs.length || 0, icon: Briefcase, color: "from-green-500 to-green-600" },
    { title: "Cover Letters", value: coverLetters.length || 0, icon: Mail, color: "from-amber-500 to-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-red-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Manage users, content, and monitor platform activity
          </p>
        </div>

        <StatsOverview stats={stats} />
        <UsersTable users={users} isLoading={usersLoading} />
      </div>
    </div>
  );
}
