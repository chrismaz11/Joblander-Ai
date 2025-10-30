import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Wand2, CheckCircle2, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIEnhancer({ content, onEnhanced, type = "bullet" }) {
  const [enhancing, setEnhancing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const buildBulletSuggestions = (text) => {
    const base = text?.trim() ? text.trim().replace(/^[-•\s]+/, "") : "Delivered key project milestones on schedule.";
    return [
      {
        version: "Quantifiable focus",
        text: `Increased impact by 25% by ${base.toLowerCase()}.`,
        reasoning: "Adds a measurable result so hiring managers can gauge the scale of your work.",
      },
      {
      version: "Achievement focus",
        text: `Led ${base.toLowerCase()} and achieved top-quartile performance across the team.`,
        reasoning: "Highlights leadership and the end result, not just responsibilities.",
      },
      {
        version: "Action-oriented focus",
        text: `Spearheaded ${base.toLowerCase()}, leveraging cross-functional teams to deliver ahead of schedule.`,
        reasoning: "Starts with a strong verb and mentions collaboration to convey ownership.",
      },
    ];
  };

  const buildSummarySuggestions = (text) => {
    const summary = text?.trim() || "Experienced professional with a track record of driving measurable impact.";
    return [
      {
        version: "Results-oriented",
        text: `${summary} Consistently delivers projects that exceed goals by combining data-driven insights with stakeholder alignment.`,
        reasoning: "Adds language about results and how they are achieved.",
      },
      {
        version: "Skills-focused",
        text: `${summary} Skilled in stakeholder communication, analytics, and cross-functional leadership across fast-paced environments.`,
        reasoning: "Surfaces the skill mix that ATS systems and recruiters scan for first.",
      },
      {
        version: "Leadership-focused",
        text: `${summary} Known for coaching high-performing teams and championing process improvements that accelerate delivery.`,
        reasoning: "Signals leadership potential for senior roles.",
      },
    ];
  };

  const buildKeywordSuggestions = (text) => {
    const normalized = (text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    const skillCandidates = ["leadership", "strategy", "analytics", "cloud", "python", "node.js", "react", "sql", "product", "communication"];
    const included = new Set(normalized);
    const missing = skillCandidates.filter((skill) => !included.has(skill));

    const keywords = missing.slice(0, 10);
    return [
      {
        version: "Keyword boost",
        text: keywords.length
          ? `Consider weaving in these keywords to improve ATS alignment: ${keywords.join(", ")}.`
          : "Your content already includes common industry keywords. Focus on tailoring them to each job post.",
        reasoning: "Keywords help you match job descriptions and surface in recruiter searches.",
      },
    ];
  };

  const enhance = () => {
    setEnhancing(true);
    setTimeout(() => {
      let result = [];
      if (type === "summary") {
        result = buildSummarySuggestions(content);
      } else if (type === "keywords") {
        result = buildKeywordSuggestions(content);
      } else {
        result = buildBulletSuggestions(content);
      }
      setSuggestions(result);
      setEnhancing(false);
    }, 250);
  };

  const applySuggestion = (suggestion) => {
    onEnhanced?.(suggestion.text);
    setSelectedSuggestion(suggestion);
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={enhance}
        disabled={enhancing || !content}
        size="sm"
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {enhancing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enhancing with AI...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Enhance with AI
          </>
        )}
      </Button>

      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <p className="text-sm font-medium text-gray-700">AI Suggestions:</p>
            </div>

            {suggestions.map((suggestion, idx) => (
              <Card
                key={idx}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedSuggestion === suggestion
                    ? "border-green-500 bg-green-50"
                    : "hover:border-purple-300 hover:bg-purple-50/50"
                }`}
                onClick={() => applySuggestion(suggestion)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-700">
                        {suggestion.version}
                      </Badge>
                      {selectedSuggestion === suggestion && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Applied
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-900">{suggestion.text}</p>
                    {suggestion.reasoning && (
                      <p className="text-xs text-gray-600 italic">{suggestion.reasoning}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      applySuggestion(suggestion);
                    }}
                  >
                    <Wand2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
