import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket } from "lucide-react";

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="border-none shadow-xl text-center">
          <CardHeader className="flex flex-col items-center gap-3">
            <Rocket className="w-8 h-8 text-purple-500" />
            <CardTitle className="text-3xl font-semibold text-gray-900">Welcome to JobLander!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600">
            <p>
              A guided onboarding flow will be available soon. You’ll be able to set career goals, outline your job
              search preferences, and receive curated recommendations in minutes.
            </p>
            <p className="text-sm text-gray-500">
              Until then, dive straight into the dashboard to create resumes, explore jobs, and track your progress.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
