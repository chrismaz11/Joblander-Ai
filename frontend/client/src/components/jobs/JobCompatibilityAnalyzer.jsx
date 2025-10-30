import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function JobCompatibilityAnalyzer({ job, userResume, onScoreCalculated }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const tokenize = (text) =>
    (text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

  const normalizeList = (items = []) =>
    items
      .map((item) => (typeof item === "string" ? item : ""))
      .filter(Boolean)
      .flatMap((item) => tokenize(item));

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const resumeContent = userResume?.enhanced_content || {};
      const resumeSkills = new Set([
        ...normalizeList(resumeContent.skills || []),
        ...normalizeList((resumeContent.experience || []).flatMap((exp) => exp?.bullets || [])),
        ...tokenize(resumeContent.summary || ""),
      ]);

      const jobKeywords = new Set([
        ...normalizeList(job.requirements || []),
        ...normalizeList(job.responsibilities || []),
        ...tokenize(job.description || ""),
        ...tokenize(job.title || ""),
      ]);

      const overlap = [...jobKeywords].filter((k) => resumeSkills.has(k));
      const matchScore =
        jobKeywords.size === 0 ? 50 : Math.round((overlap.length / jobKeywords.size) * 100);

      const strengths = overlap.slice(0, 5).map((match) => `Highlights experience with "${match}".`);
      const gaps = [...jobKeywords]
        .filter((k) => !resumeSkills.has(k))
        .slice(0, 5)
        .map((gap) => `Add examples or keywords for “${gap}” to mirror the job description.`);

      const recommendations = [];
      if (matchScore < 60) {
        recommendations.push("Tailor the summary to mirror the job title and top 2–3 responsibilities.");
      }
      if (gaps.length > 0) {
        recommendations.push("Weave missing keywords into bullets or skills to improve ATS alignment.");
      }
      if (!resumeContent.summary) {
        recommendations.push("Add a summary that captures experience level, domain focus, and key wins.");
      }

      const analysisResult = {
        match_score: Math.min(Math.max(matchScore, 0), 100),
        strengths: strengths.length
          ? strengths
          : ["Your resume already captures broadly relevant experience—great job!"],
        gaps,
        recommendations: recommendations.length
          ? recommendations
          : ["Continue tailoring each application to the job description for even better results."],
        summary:
          matchScore >= 70
            ? "Strong alignment. A few tweaks to highlight recent wins will make this application stand out."
            : "Solid foundation. Focus on mirroring job keywords and showcasing measurable achievements.",
      };

      setAnalysis(analysisResult);
      onScoreCalculated?.(analysisResult.match_score, analysisResult.summary);
      setAnalyzing(false);
    }, 250);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-blue-500 to-cyan-500";
    if (score >= 40) return "from-amber-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  return (
    <div className="space-y-4">
      {!analysis ? (
        <Button
          onClick={handleAnalyze}
          disabled={analyzing || !userResume}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Compatibility...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Job Compatibility
            </>
          )}
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className={`w-32 h-32 mx-auto bg-gradient-to-br ${getScoreColor(analysis.match_score)} rounded-full flex items-center justify-center shadow-xl`}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">{analysis.match_score}</div>
                    <div className="text-xs text-white/80">Match Score</div>
                  </div>
                </div>
                <p className="text-gray-700">{analysis.summary}</p>
              </div>
            </CardContent>
          </Card>

          {analysis.strengths?.length > 0 && (
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Your Strengths
                </h4>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-green-800">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {analysis.gaps?.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Areas to Address
                </h4>
                <ul className="space-y-2">
                  {analysis.gaps.map((gap, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-amber-800">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      {gap}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {analysis.recommendations?.length > 0 && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-blue-800">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
