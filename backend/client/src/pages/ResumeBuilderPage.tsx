import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/context/appStore";
import { apiClient } from "@/utils/api";
import { formatTimeAgo } from "@/utils/format";
import {
  ArrowUpFromLine,
  FileText,
  LayoutTemplate,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";

type ParsedResume = {
  rawText: string;
  sections: Record<string, string[]>;
  metadata: {
    filename: string;
    size: number;
    uploadedAt: string;
    mimetype: string;
  };
};

type ResumeRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  personalInfo?: {
    fullName?: string;
    title?: string;
    email?: string;
    phone?: string;
    summary?: string;
  };
  experience?: Array<{
    title?: string;
    company?: string;
    location?: string;
    start?: string;
    end?: string;
    highlights?: string[];
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    graduation?: string;
  }>;
  skills?: string[];
  suggestions?: string[];
  templateId?: string;
};

type ResumeGenerateResponse = {
  resume: ResumeRecord;
  preview: string;
};

type TemplateSummary = {
  id: string;
  name: string;
  description: string;
  preview: string;
  accentColor?: string;
  layout?: string;
};

type TemplatesResponse = TemplateSummary[];

const buildPayloadFromParsed = (parsed: ParsedResume | null) => {
  if (!parsed) {
    return {
      personalInfo: {},
      experience: [],
      education: [],
      skills: [],
    };
  }

  const summary = parsed.sections?.summary?.join(" ") ?? "";
  const experienceLines = parsed.sections?.experience ?? [];
  const educationLines = parsed.sections?.education ?? [];
  const skillsLines = parsed.sections?.skills ?? [];

  return {
    personalInfo: {
      fullName:
        parsed.metadata.filename?.replace(/\.[^.]+$/, "") ?? "Candidate",
      summary,
    },
    experience: experienceLines.map((line, index) => ({
      title: line,
      company: "",
      highlights: [line],
      start: "",
      end: "",
      location: "",
      id: `exp-${index}`,
    })),
    education: educationLines.map((line, index) => ({
      institution: line,
      degree: "",
      graduation: "",
      id: `edu-${index}`,
    })),
    skills: skillsLines
      .join(", ")
      .split(/[•,;|]/)
      .map((item) => item.trim())
      .filter(Boolean),
  };
};

export const ResumeBuilderPage = () => {
  const user = useAppStore((state) => state.user);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const templatesQuery = useQuery({
    queryKey: ["resume-templates"],
    queryFn: () => apiClient.get<TemplatesResponse>("/api/resume/templates"),
  });

  const resumesQuery = useQuery({
    queryKey: ["resumes"],
    queryFn: () => apiClient.get<ResumeRecord[]>("/api/resumes"),
  });

  const parseMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiClient.postForm<ParsedResume>("/api/resume/parse", formData);
    },
    onSuccess: (data) => {
      setParsedResume(data);
      setStatusMessage("Resume parsed successfully. Review the insights below.");
    },
    onError: (error: Error) => {
      setStatusMessage(error.message);
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const payload = buildPayloadFromParsed(parsedResume);
      return apiClient.post<ResumeGenerateResponse>("/api/resume/generate", {
        userId: user.id,
        tier: user.tier,
        templateId: selectedTemplate,
        ...payload,
      });
    },
    onSuccess: (data) => {
      setPreviewHtml(data.preview);
      setStatusMessage("Resume enhanced with AI recommendations.");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: (error: Error) => {
      setStatusMessage(error.message);
    },
  });

  const handleFileBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatusMessage("Parsing resume…");
    parseMutation.mutate(file);
  };

  const handleGenerate = () => {
    if (!parsedResume) {
      setStatusMessage("Upload a resume to kick off the enhancement pipeline.");
      return;
    }
    setStatusMessage("Running AI enhancement…");
    generateMutation.mutate();
  };

  const templateOptions = templatesQuery.data ?? [
    {
      id: "modern",
      name: "Modern Executive",
      description: "Clean layout tuned for leadership roles.",
      preview: "/resume-templates/template-01.png",
      accentColor: "#1D4ED8",
      layout: "two-column",
    },
  ];

  const recentResumes = resumesQuery.data ?? [];

  const parsedSummary = useMemo(() => {
    if (!parsedResume) return [];
    return Object.entries(parsedResume.sections || {});
  }, [parsedResume]);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="accent">Resume Intelligence</Badge>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Build ATS-proof resumes with{" "}
          <span className="text-accent">Gemini-powered enhancements</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Upload, enhance, and export executive-grade resumes. JobLander AI
          analyzes structure, language, keywords, and positioning so every
          application tells a compelling story.
        </p>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">
              Upload & enhance
            </h2>
            <p className="text-sm text-muted-foreground">
              PDF or DOCX uploads supported. JobLander AI restructures,
              rewrites, and prepares export-ready templates.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4 rounded-2xl border border-dashed border-primary/30 bg-surface/60 p-6">
              <div className="flex flex-1 flex-col gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs uppercase tracking-wide text-primary">
                  <ArrowUpFromLine className="h-4 w-4" />
                  Drop resume or browse
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Drag & drop your latest resume
                </h3>
                <p className="text-sm text-muted-foreground">
                  We parse structure, rewrite bullets, optimize keywords, and
                  surface ATS blockers instantly.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" className="gap-2" onClick={handleFileBrowse}>
                    <FileText className="h-4 w-4" />
                    Upload resume
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" disabled>
                    <Sparkles className="h-4 w-4" />
                    Start from AI template
                  </Button>
                </div>
              </div>
              <div className="hidden w-52 flex-col justify-between rounded-2xl border border-border/40 bg-surface/80 p-4 text-xs text-muted-foreground md:flex">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Enhancement pipeline
                  </p>
                  <ul className="mt-2 space-y-2">
                    <li>• Parsing & structure validation</li>
                    <li>• Impact-focused rewrites</li>
                    <li>• Keyword & ATS alignment</li>
                    <li>• Template styling + export</li>
                  </ul>
                </div>
                <p className="rounded-xl bg-primary/10 p-3 text-primary">
                  {user.aiCredits} AI credits remaining this cycle
                </p>
              </div>
            </div>

            {statusMessage && (
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-primary">
                {statusMessage}
              </div>
            )}

            {parsedSummary.length > 0 && (
              <div className="rounded-2xl border border-border/40 bg-surface/70 p-5">
                <h3 className="text-sm font-semibold text-foreground">
                  Parsed resume insight
                </h3>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  {parsedSummary.map(([section, lines]) => (
                    <div key={section}>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {section}
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {lines.slice(0, 6).map((line) => (
                          <li key={line}>• {line}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleGenerate}
                size="sm"
                className="gap-2"
                disabled={generateMutation.isPending}
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enhancing…
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Run AI enhancement
                  </>
                )}
              </Button>
              {generateMutation.isError && (
                <span className="text-sm text-red-500">
                  {generateMutation.error instanceof Error
                    ? generateMutation.error.message
                    : "Enhancement failed"}
                </span>
              )}
            </div>

            {previewHtml && (
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-white shadow-inner">
                <iframe
                  title="Resume preview"
                  srcDoc={previewHtml}
                  className="h-[420px] w-full"
                />
              </div>
            )}

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">
                  Recent enhancements
                </h3>
                <Button variant="ghost" size="sm" className="gap-2 text-primary">
                  View version history
                  <ArrowUpFromLine className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-4">
                {recentResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-surface/70 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {resume.personalInfo?.fullName ?? "Resume"}
                        </h4>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Updated {formatTimeAgo(resume.updatedAt)}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {resume.templateId ?? "modern"}
                      </Badge>
                    </div>
                    {resume.suggestions && resume.suggestions.length > 0 && (
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {resume.suggestions.slice(0, 2).map((tip) => (
                          <p key={tip}>• {tip}</p>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" className="gap-2" onClick={() => setPreviewHtml(renderFallbackPreview(resume))}>
                        <Sparkles className="h-4 w-4" />
                        Load preview
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Export PDF
                      </Button>
                    </div>
                  </div>
                ))}
                {recentResumes.length === 0 && (
                  <div className="rounded-2xl border border-border/40 bg-surface/70 p-5 text-sm text-muted-foreground">
                    Upload a resume to begin tracking enhancements.
                  </div>
                )}
              </div>
            </section>
          </CardContent>
        </Card>

        <Card className="space-y-6 p-6">
          <div className="rounded-2xl border border-primary/25 bg-primary/10 p-5 text-sm text-primary">
            <p className="font-semibold">AI resume coach</p>
            <p className="mt-2 text-primary/90">
              “We identify weak bullets, fill data gaps, and align keywords. Ready for a new round of enhancements?”
            </p>
            <Button
              onClick={handleGenerate}
              size="sm"
              className="mt-4 w-full gap-2"
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enhancing…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Run Gemini enhancement
                </>
              )}
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Template gallery
            </h3>
            <p className="mb-4 text-xs uppercase tracking-wide text-muted-foreground">
              ATS-friendly, recruiter-approved designs
            </p>
            <div className="space-y-4 text-sm text-muted-foreground">
              {templateOptions.map((template) => {
                const isSelected = selectedTemplate === template.id;
                const layoutLabel = template.layout
                  ? template.layout.replace(/-/g, " ")
                  : null;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`group w-full rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      isSelected
                        ? "border-primary/60 bg-primary/5 text-foreground shadow-lg"
                        : "border-border/40 bg-surface/70 hover:border-primary/30"
                    }`}
                    style={
                      isSelected && template.accentColor
                        ? { borderColor: template.accentColor }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="relative h-24 w-32 overflow-hidden rounded-xl border border-border/40 bg-background shadow-sm transition group-hover:border-primary/40"
                        style={
                          template.accentColor
                            ? { borderColor: template.accentColor }
                            : undefined
                        }
                      >
                        <img
                          src={template.preview}
                          alt={`${template.name} preview`}
                          className="h-full w-full object-cover"
                        />
                        {isSelected && (
                          <span className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {template.name}
                            </p>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {template.description}
                            </p>
                          </div>
                          {isSelected && <Badge variant="secondary">Selected</Badge>}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                          {template.accentColor && (
                            <span className="flex items-center gap-1">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: template.accentColor }}
                              />
                              Accent
                            </span>
                          )}
                          {layoutLabel && (
                            <span className="flex items-center gap-1">
                              <LayoutTemplate className="h-3 w-3" />
                              {layoutLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Quality score</h3>
            <p className="text-xs text-muted-foreground">
              Benchmarked against executive hires
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Structure
                </p>
                <Progress value={parsedResume ? 92 : 70} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Impact communication
                </p>
                <Progress value={parsedResume ? 88 : 65} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  ATS alignment
                </p>
                <Progress value={parsedResume ? 85 : 60} />
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

function renderFallbackPreview(resume: ResumeRecord) {
  const name = resume.personalInfo?.fullName ?? "Candidate";
  const summary = resume.personalInfo?.summary ?? "";
  const skillList = Array.isArray(resume.skills) ? resume.skills : [];
  const skills = skillList.join(" · ");
  return `<!doctype html>
  <html><body style="font-family:Inter,Arial,sans-serif;padding:32px;color:#111827;">
    <h1 style="margin-bottom:4px;">${name}</h1>
    <p style="color:#4b5563;">${summary}</p>
    <h2 style="margin-top:24px;color:#1d4ed8;">Skills</h2>
    <p>${skills}</p>
  </body></html>`;
}
