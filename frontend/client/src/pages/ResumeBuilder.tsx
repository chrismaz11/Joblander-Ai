import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Upload, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Resume } from "@shared/schema";

import ResumeUploader from "../components/resume/ResumeUploader";
import ResumeList from "../components/resume/ResumeList";
import ResumeEditor from "../components/resume/ResumeEditor";

interface EditorExperience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  bullets: string[];
}

interface EditorEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduation_date: string;
}

interface EditorResume {
  id?: string;
  title: string;
  template_id: string;
  enhanced_content: {
    personal_info: {
      full_name: string;
      email: string;
      phone: string;
      location?: string;
      linkedin?: string;
      website?: string;
    };
    summary: string;
    experience: EditorExperience[];
    education: EditorEducation[];
    skills: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface ResumePayload {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location?: string;
    linkedin?: string;
    website?: string;
    summary?: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
  }>;
  skills: string[];
  templateId: string;
}

function generateId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function mapResumeToEditor(resume: Resume | null): EditorResume | null {
  if (!resume) return null;

  const experience = (resume.experience || []).map((exp) => ({
    id: exp.id || generateId("exp"),
    company: exp.company || "",
    position: exp.position || "",
    start_date: exp.startDate || "",
    end_date: exp.endDate || "",
    bullets: exp.description ? exp.description.split(/\r?\n/).filter(Boolean) : [],
  }));

  const education = (resume.education || []).map((edu) => ({
    id: edu.id || generateId("edu"),
    institution: edu.institution || "",
    degree: edu.degree || "",
    field: edu.field || "",
    graduation_date: edu.endDate || "",
  }));

  return {
    id: resume.id,
    title: resume.personalInfo?.fullName
      ? `${resume.personalInfo.fullName} Resume`
      : "New Resume",
    template_id: resume.templateId || "modern",
    enhanced_content: {
      personal_info: {
        full_name: resume.personalInfo?.fullName || "",
        email: resume.personalInfo?.email || "",
        phone: resume.personalInfo?.phone || "",
        location: resume.personalInfo?.location || "",
        linkedin: resume.personalInfo?.linkedin || "",
        website: resume.personalInfo?.website || "",
      },
      summary: resume.personalInfo?.summary || "",
      experience,
      education,
      skills: resume.skills || [],
    },
  } as EditorResume;
}

function mapEditorToPayload(resumeData: EditorResume): ResumePayload {
  const content =
    resumeData?.enhanced_content ??
    ({
      personal_info: {
        full_name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        website: "",
      },
      summary: "",
      experience: [],
      education: [],
      skills: [],
    } as EditorResume["enhanced_content"]);

  const personal = content.personal_info ?? {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
  };

  return {
    personalInfo: {
      fullName: personal.full_name || "",
      email: personal.email || "",
      phone: personal.phone || "",
      location: personal.location || "",
      linkedin: personal.linkedin || "",
      website: personal.website || "",
      summary: content.summary || "",
    },
    experience: (content.experience || []).map((exp: any, index: number) => ({
      id: exp.id || generateId(`exp-${index}`),
      company: exp.company || "",
      position: exp.position || "",
      startDate: exp.start_date || "",
      endDate: exp.end_date || "",
      current: !exp.end_date,
      description: Array.isArray(exp.bullets) ? exp.bullets.filter(Boolean).join("\n") : "",
    })),
    education: (content.education || []).map((edu: any, index: number) => ({
      id: edu.id || generateId(`edu-${index}`),
      institution: edu.institution || "",
      degree: edu.degree || "",
      field: edu.field || "",
      startDate: "", // Optional field not currently captured
      endDate: edu.graduation_date || "",
      current: false,
    })),
    skills: Array.isArray(content.skills)
      ? content.skills.filter(Boolean)
      : [],
    templateId: resumeData?.template_id || "modern",
  };
}

function mapParsedResumeToPayload(parsed: any): ResumePayload {
  const personalInfo = parsed.personalInfo || {};

  const experience = Array.isArray(parsed.experience)
    ? parsed.experience.map((exp: any, index: number) => ({
        id: exp.id || generateId(`parsed-exp-${index}`),
        company: exp.company || "",
        position: exp.position || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        current: Boolean(exp.current),
        description: exp.description || "",
      }))
    : [];

  const education = Array.isArray(parsed.education)
    ? parsed.education.map((edu: any, index: number) => ({
        id: edu.id || generateId(`parsed-edu-${index}`),
        institution: edu.institution || "",
        degree: edu.degree || "",
        field: edu.field || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        current: Boolean(edu.current),
      }))
    : [];

  const skills = Array.isArray(parsed.skills) ? parsed.skills.filter(Boolean) : [];

  return {
    personalInfo: {
      fullName: personalInfo.fullName || "",
      email: personalInfo.email || "",
      phone: personalInfo.phone || "",
      location: personalInfo.location || "",
      linkedin: personalInfo.linkedin || "",
      website: personalInfo.website || "",
      summary: personalInfo.summary || "",
    },
    experience,
    education,
    skills,
    templateId: "modern",
  };
}

export default function ResumeBuilder() {
  const [showUploader, setShowUploader] = useState(false);
  const [selectedResume, setSelectedResume] = useState<EditorResume | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [currentStep, setCurrentStep] = useState<"list" | "upload" | "edit">("list");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: remoteResumes = [],
    isLoading,
  } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
    initialData: [],
  });

  const createResumeMutation = useMutation<Resume, Error, ResumePayload>({
    mutationFn: async (payload) =>
      apiRequest("POST", "/api/resumes", payload) as Promise<Resume>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
    },
  });

  const updateResumeMutation = useMutation<Resume, Error, { id: string; data: ResumePayload }>({
    mutationFn: async ({ id, data }) =>
      apiRequest("PATCH", `/api/resumes/${id}`, data) as Promise<Resume>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
    },
  });

  const deleteResumeMutation = useMutation<unknown, Error, string>({
    mutationFn: async (id) => apiRequest("DELETE", `/api/resumes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({ title: "Resume deleted" });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUploadComplete = async (parsedData: any) => {
    try {
      const payload = mapParsedResumeToPayload(parsedData);
      const created = await createResumeMutation.mutateAsync(payload);

      toast({
        title: "Resume created",
        description: "We parsed your document and created a draft for you.",
      });

      setSelectedResume(mapResumeToEditor(created));
      setShowUploader(false);
      setShowEditor(true);
      setCurrentStep("edit");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveResume = async (resumeData: EditorResume) => {
    const payload = mapEditorToPayload(resumeData);

    try {
      if (selectedResume?.id) {
        await updateResumeMutation.mutateAsync({ id: selectedResume.id, data: payload });
        toast({ title: "Resume updated" });
      } else {
        await createResumeMutation.mutateAsync(payload);
        toast({ title: "Resume created" });
      }
      setShowEditor(false);
      setShowUploader(false);
      setSelectedResume(null);
      setCurrentStep("list");
    } catch (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (resume) => {
    setSelectedResume(mapResumeToEditor(resume));
    setShowEditor(true);
    setCurrentStep("edit");
  };

  const handleCreateNew = () => {
    setSelectedResume(null);
    setShowEditor(true);
    setCurrentStep("edit");
  };

  const handleBackToList = () => {
    setShowEditor(false);
    setShowUploader(false);
    setSelectedResume(null);
    setCurrentStep("list");
  };

  const handleDelete = (id) => {
    deleteResumeMutation.mutate(id);
  };

  const currentTier = (user?.tier || "free").toLowerCase();
  const resumeLimit = useMemo(() => {
    const limits = {
      free: 3,
      basic: 10,
      professional: Infinity,
      enterprise: Infinity,
    };
    return limits[currentTier] ?? limits.free;
  }, [currentTier]);

  const canCreateMore =
    resumeLimit === Infinity || remoteResumes.length < resumeLimit;

  const isSaving = createResumeMutation.isPending || updateResumeMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="flex items-center gap-4">
            {(showEditor || showUploader) && (
              <Button variant="ghost" size="icon" onClick={handleBackToList}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {currentStep === "edit"
                  ? "Edit Resume"
                  : currentStep === "upload"
                  ? "Upload Resume"
                  : "Resume Builder"}
              </h1>
              <p className="text-gray-600">
                {currentStep === "edit"
                  ? "Refine your resume and tailor it to each opportunity."
                  : currentStep === "upload"
                  ? "Upload your existing resume to get started quickly."
                  : "Create ATS-optimized resumes with AI assistance."}
              </p>
            </div>
          </div>

          {currentStep === "list" && (
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  if (!canCreateMore) return;
                  setShowUploader(true);
                  setCurrentStep("upload");
                }}
                variant="outline"
                className="gap-2"
                disabled={!canCreateMore}
              >
                <Upload className="w-4 h-4" />
                Upload Resume
              </Button>
              <Button
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                disabled={!canCreateMore}
              >
                <Plus className="w-5 h-5" />
                Create from Scratch
              </Button>
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {showUploader ? (
            <ResumeUploader onCancel={handleBackToList} onComplete={handleUploadComplete} />
          ) : showEditor ? (
            <ResumeEditor
              resume={selectedResume}
              onSave={handleSaveResume}
              onCancel={handleBackToList}
              isSaving={isSaving}
            />
          ) : (
            <ResumeList
              resumes={remoteResumes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading || deleteResumeMutation.isPending}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
