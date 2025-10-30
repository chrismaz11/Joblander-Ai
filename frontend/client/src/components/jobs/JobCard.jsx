import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Calendar, Bookmark, CheckCircle2, Eye } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function JobCard({ job, onToggleSave, onToggleApplied }) {
  const typeColors = {
    full_time: "bg-blue-100 text-blue-700",
    part_time: "bg-purple-100 text-purple-700",
    contract: "bg-amber-100 text-amber-700",
    internship: "bg-green-100 text-green-700",
    remote: "bg-pink-100 text-pink-700",
  };

  const levelColors = {
    entry: "bg-gray-100 text-gray-700",
    mid: "bg-blue-100 text-blue-700",
    senior: "bg-purple-100 text-purple-700",
    lead: "bg-amber-100 text-amber-700",
    executive: "bg-red-100 text-red-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {job.title}
                </h3>
                <p className="text-gray-700 font-medium mb-2">{job.company}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={typeColors[job.job_type] || "bg-gray-100 text-gray-700"}>
                    {(job.job_type || job.employmentType || "unknown").replace(/_/g, " ")}
                  </Badge>
                  <Badge className={levelColors[job.experience_level] || "bg-gray-100 text-gray-700"}>
                    {(job.experience_level || job.seniorityLevel || "unspecified").replace(/_/g, " ")}
                  </Badge>
                  {job.aiMatchScore && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      {job.aiMatchScore}% Match
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location || job.city || "Remote"}
                  </div>
                  {job.posted_date || job.postedDate ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(job.posted_date || job.postedDate), "MMM d, yyyy")}
                    </div>
                  ) : null}
                  {job.salary_range || job.salary ? (
                    <div className="font-medium text-green-600">
                      {job.salary_range || job.salary}
                    </div>
                  ) : null}
                </div>
                {job.description && (
                  <p className="text-gray-600 mt-3 line-clamp-2">
                    {job.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleSave?.(!job.is_saved)}
              className={job.is_saved ? "bg-blue-50 text-blue-600 border-blue-200" : ""}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${job.is_saved ? 'fill-blue-600' : ''}`} />
              {job.is_saved ? 'Saved' : 'Save'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleApplied?.(!job.applied)}
              className={job.applied ? "bg-green-50 text-green-600 border-green-200" : ""}
            >
              <CheckCircle2 className={`w-4 h-4 mr-2 ${job.applied ? 'fill-green-600' : ''}`} />
              {job.applied ? 'Applied' : 'Mark as Applied'}
            </Button>
            <Link to={`/jobs?id=${job.id}`} className="ml-auto">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
