import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lightbulb, Wand2, TrendingUp, Loader2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIAssistancePanel({ resumeData, onApplySuggestion }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(resumeData?.ai_suggestions || []);
  const [customRequest, setCustomRequest] = useState("");
  const [generatedContent, setGeneratedContent] = useState(null);

  const priorityColors = useMemo(
    () => ({
      high: "bg-red-100 text-red-700",
      medium: "bg-amber-100 text-amber-700",
      low: "bg-blue-100 text-blue-700",
    }),
    [],
  );

  const buildSuggestions = () => {
    const content = resumeData?.enhanced_content || {};
    const personal = content.personal_info || {};
    const experiences = content.experience || [];
    const skills = content.skills || [];
    const result = [];

    if (!content.summary || content.summary.trim().length < 120) {
      result.push({
        title: "Strengthen your summary",
        description:
          "Expand your professional summary to highlight years of experience, top strengths, and standout achievements in 3–4 sentences.",
        priority: "high",
      });
    }

    const hasMetrics =
      experiences.some((exp) =>
        (exp?.bullets || []).some((bullet) => /\d/.test(bullet || "")),
      ) || /\d/.test(content.summary || "");
    if (!hasMetrics) {
      result.push({
        title: "Add measurable impact",
        description: "Include metrics (%, $, time saved) in experience bullets so employers understand the scale of your results.",
        priority: "high",
      });
    }

    if ((skills || []).length < 8) {
      result.push({
        title: "Broaden your skills section",
        description: "List at least 8 skills that match your target role, mixing technical tools and soft skills.",
        priority: "medium",
      });
    }

    if (!personal.linkedin && !personal.website) {
      result.push({
        title: "Link to professional profiles",
        description: "Add your LinkedIn or portfolio so recruiters can explore more of your work with one click.",
        priority: "medium",
      });
    }

    if (experiences.length === 0) {
      result.push({
        title: "Add recent experience",
        description: "Include your most recent role with 3–5 bullet points focusing on achievements, not job duties.",
        priority: "high",
      });
    }

    if (result.length < 5 && content.summary && content.summary.length > 220) {
      result.push({
        title: "Tighten your summary",
        description: "Summaries work best when concise. Trim to the most relevant points for your next role.",
        priority: "low",
      });
    }

    if (result.length === 0) {
      result.push({
        title: "Great foundation",
        description: "Your resume covers key areas. Tailor it to each posting by mirroring keywords from the job description.",
        priority: "low",
      });
    }

    return result.slice(0, 5);
  };

  const handleGenerateSuggestions = () => {
    setLoading(true);
    setTimeout(() => {
      setSuggestions(buildSuggestions());
      setLoading(false);
    }, 250);
  };

  const handleCustomRequest = () => {
    if (!customRequest.trim()) return;

    setLoading(true);
    const request = customRequest.trim();
    setTimeout(() => {
      setGeneratedContent(
        `Here’s how to approach “${request}”:\n\n` +
          "• Start with a strong action verb.\n" +
          "• Mention the tools, teams, or methods you used.\n" +
          "• Close with a measurable outcome (percentage, revenue, time saved).\n\n" +
          "Tailor the language so it matches the job description and keeps the tone professional.",
      );
      setLoading(false);
    }, 200);
  };

  return (
    <div className="space-y-4">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleGenerateSuggestions} disabled={loading} variant="outline" className="w-full justify-start">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lightbulb className="w-4 h-4 mr-2" />}
            Generate Improvement Suggestions
          </Button>

          <div className="space-y-2">
            <Textarea
              placeholder="Ask AI anything... (e.g., 'Make my summary more impactful' or 'Improve this bullet point')"
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              rows={3}
              className="text-sm"
            />
            <Button
              onClick={handleCustomRequest}
              disabled={loading || !customRequest.trim()}
              size="sm"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Ask AI
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Suggestions ({suggestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestions.map((suggestion, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {suggestion.title || `Suggestion ${idx + 1}`}
                          </h4>
                          {suggestion.priority && (
                            <Badge className={`text-xs ${priorityColors[suggestion.priority]}`}>
                              {suggestion.priority}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{suggestion.description || suggestion}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {generatedContent && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    AI Response
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setGeneratedContent(null)}>
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{generatedContent}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700">
          <p>• Use action verbs: Led, Increased, Developed, Managed</p>
          <p>• Quantify achievements: "Increased sales by 40%"</p>
          <p>• Include relevant keywords from job descriptions</p>
          <p>• Keep bullets concise: 1-2 lines each</p>
        </CardContent>
      </Card>
    </div>
  );
}
