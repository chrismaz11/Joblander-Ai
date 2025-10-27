import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/utils/api";
import { useAppStore } from "@/context/appStore";
import { formatTimeAgo } from "@/utils/format";
import {
  ArrowLeftRight,
  Clipboard,
  FileText,
  Loader2,
  PenLine,
  Sparkles,
} from "lucide-react";

type ResumeOption = {
  id: string;
  personalInfo?: {
    fullName?: string;
  };
};

type CoverLetterRecord = {
  id: string;
  resumeId: string;
  companyName: string;
  position: string;
  tone: "professional" | "enthusiastic" | "executive";
  content: string;
  variants: Record<string, string>;
  updatedAt: string;
  createdAt: string;
};

type CoverLetterResponse = CoverLetterRecord;

export const CoverLettersPage = () => {
  const user = useAppStore((state) => state.user);
  const queryClient = useQueryClient();

  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "executive">("professional");
  const [clipboardMessage, setClipboardMessage] = useState<string>("");

  const resumesQuery = useQuery({
    queryKey: ["resumes"],
    queryFn: () => apiClient.get<ResumeOption[]>("/api/resumes"),
  });

  const coverLettersQuery = useQuery({
    queryKey: ["cover-letters"],
    queryFn: () => apiClient.get<CoverLetterRecord[]>("/api/cover-letters"),
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!selectedResumeId) {
        throw new Error("Select a resume to personalize the cover letter.");
      }
      const payload = {
        resumeId: selectedResumeId,
        companyName,
        position,
        jobDescription,
        tone,
        userId: user.id,
        tier: user.tier,
      };
      return apiClient.post<CoverLetterResponse>("/api/cover-letters", payload);
    },
    onSuccess: () => {
      setClipboardMessage("Cover letter generated. Copy or adjust the draft below.");
      queryClient.invalidateQueries({ queryKey: ["cover-letters"] });
    },
    onError: (error: Error) => {
      setClipboardMessage(error.message);
    },
  });

  const coverLetters = coverLettersQuery.data ?? [];
  const resumes = resumesQuery.data ?? [];

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setClipboardMessage("Copied to clipboard.");
    } catch (error) {
      setClipboardMessage("Copy failed. Select and copy manually.");
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="accent">AI Cover Letters</Badge>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Tailor every pitch with{" "}
          <span className="text-accent">executive-grade storytelling</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          JobLander AI drafts, personalizes, and iterates cover letters based on
          the role, your resume, and the company narrative. Zero blank-page
          energy.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">
              Generate new cover letter
            </h2>
            <p className="text-sm text-muted-foreground">
              Fuse your resume, role insights, and company voice with one click.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">
                Select resume
              </label>
              <select
                className="w-full rounded-2xl border border-border/40 bg-surface/70 p-3 text-sm text-foreground outline-none"
                value={selectedResumeId}
                onChange={(event) => setSelectedResumeId(event.target.value)}
              >
                <option value="">Choose a resume…</option>
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.personalInfo?.fullName ?? "Resume"}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">
                Company
              </label>
              <div className="rounded-2xl border border-border/40 bg-surface/70 p-3">
                <input
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="NeuralBridge Labs"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">
                Role
              </label>
              <div className="rounded-2xl border border-border/40 bg-surface/70 p-3">
                <input
                  value={position}
                  onChange={(event) => setPosition(event.target.value)}
                  placeholder="Director of AI Product Strategy"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">
                Talking points
              </label>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Highlight AI portfolio transformation, global-scale launches, cross-functional leadership..."
                className="w-full rounded-2xl border border-border/40 bg-surface/70 p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wide text-muted-foreground">
                Tone
              </label>
              <div className="flex gap-2">
                {(["professional", "enthusiastic", "executive"] as const).map((value) => (
                  <button
                    key={value}
                    onClick={() => setTone(value)}
                    className={`flex-1 rounded-2xl border px-4 py-3 text-sm capitalize transition ${
                      tone === value
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border/40 bg-surface/70 hover:border-primary/30"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full gap-2"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating with AI…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate cover letter
                </>
              )}
            </Button>
            {clipboardMessage && (
              <p className="text-xs text-muted-foreground">{clipboardMessage}</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-5">
          {coverLetters.map((letter) => (
            <Card key={letter.id} className="border border-border/50 bg-surface/80">
              <CardContent className="space-y-4 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {letter.position}
                    </h3>
                    <p className="text-sm text-muted-foreground">{letter.companyName}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {formatTimeAgo(letter.updatedAt)} • Tone: {letter.tone}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {letter.tone}
                  </Badge>
                </div>
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl border border-border/40 bg-surface/70 p-4 text-sm text-muted-foreground">
                  {letter.content}
                </pre>
                <div className="flex flex-wrap gap-3">
                  <Button className="gap-2">
                    <PenLine className="h-4 w-4" />
                    Open editor
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 text-primary"
                    onClick={() => handleCopy(letter.content)}
                  >
                    <Clipboard className="h-4 w-4" />
                    Copy to clipboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="gap-2 text-muted-foreground"
                    onClick={() => {
                      const nextTone = letter.tone === "professional" ? "enthusiastic" : letter.tone === "enthusiastic" ? "executive" : "professional";
                      const newContent = letter.variants[nextTone] ?? letter.content;
                      handleCopy(newContent);
                      setClipboardMessage(`Switched tone to ${nextTone}. Content copied.`);
                    }}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    Switch tone
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {coverLetters.length === 0 && (
            <Card className="border border-dashed border-primary/40 bg-primary/5 p-6">
              <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Generate your first cover letter
                  </p>
                  <p>
                    Select a resume, pick your tone, and JobLander AI will craft a tailored pitch.
                  </p>
                </div>
                <Button variant="outline" className="gap-2" onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
                  <FileText className="h-4 w-4" />
                  Generate now
                </Button>
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};
