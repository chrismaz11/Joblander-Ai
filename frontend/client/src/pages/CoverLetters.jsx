import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CoverLetters() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [coverLetters, setCoverLetters] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-orange-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cover Letters</h1>
            <p className="text-gray-600">
              Generate personalized cover letters with AI for any job application
            </p>
          </div>
          {!showGenerator && (
            <Button
              onClick={() => setShowGenerator(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Cover Letter
            </Button>
          )}
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {showGenerator ? (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Generate a cover letter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    The AI cover letter assistant is coming soon. For now, outline your achievements and tailor the
                    opening to why you’re excited about the role.
                  </p>
                  <Button variant="outline" onClick={() => setShowGenerator(false)}>
                    Back to saved letters
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-amber-600" />
                    Saved Cover Letters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {coverLetters.length === 0 ? (
                    <div className="text-center text-sm text-gray-600">
                      No cover letters yet. Craft one tailored to a role and keep it alongside your resume.
                    </div>
                  ) : (
                    coverLetters.map((letter) => (
                      <Card key={letter.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900">{letter.title}</h4>
                          <p className="text-sm text-gray-600">{letter.company}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
