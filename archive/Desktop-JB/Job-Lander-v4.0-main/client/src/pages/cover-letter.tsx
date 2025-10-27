import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CoverLetterEditor } from "@/components/CoverLetterEditor";
import { Loader2, FileText, Sparkles, Briefcase } from "lucide-react";
import type { Resume, CoverLetter } from "@shared/schema";

const formSchema = z.object({
  resumeId: z.string().min(1, "Please select a resume"),
  companyName: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  jobDescription: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CoverLetterPage() {
  const { toast } = useToast();
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<CoverLetter | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch user's resumes
  const { data: resumes = [], isLoading: isLoadingResumes } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeId: "",
      companyName: "",
      position: "",
      jobDescription: "",
    },
  });

  // Generate cover letter mutation
  const generateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      setIsGenerating(true);
      const response = await apiRequest("POST", "/api/generate-coverletter", data);
      return response;
    },
    onSuccess: (data) => {
      setGeneratedCoverLetter(data);
      setIsGenerating(false);
      toast({
        title: "Cover letters generated!",
        description: "All 3 tone variants have been created successfully.",
      });
    },
    onError: (error: any) => {
      setIsGenerating(false);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate cover letters. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: FormData) => {
    generateMutation.mutate(data);
  };

  const handleSaveEdit = (tone: string, content: string) => {
    // Here we could add an API call to save the edited version
    console.log(`Saving ${tone} version:`, content);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Cover Letter Generator</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create compelling cover letters with 3 unique tones tailored to your resume and job posting
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant="secondary">
              <Briefcase className="w-3 h-3 mr-1" />
              Professional
            </Badge>
            <Badge variant="secondary" className="text-blue-600 dark:text-blue-400">
              <Sparkles className="w-3 h-3 mr-1" />
              Concise
            </Badge>
            <Badge variant="secondary" className="text-purple-600 dark:text-purple-400">
              <Sparkles className="w-3 h-3 mr-1" />
              Bold
            </Badge>
          </div>
        </div>

        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Cover Letter</CardTitle>
            <CardDescription>
              Fill in the details below to generate personalized cover letters in 3 different tones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Resume Selector */}
                  <FormField
                    control={form.control}
                    name="resumeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Resume</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-resume">
                              <SelectValue placeholder="Choose a resume" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingResumes ? (
                              <div className="p-2">
                                <Skeleton className="h-4 w-full" />
                              </div>
                            ) : resumes.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground">
                                No resumes found. Please create a resume first.
                              </div>
                            ) : (
                              resumes.map((resume) => (
                                <SelectItem key={resume.id} value={resume.id}>
                                  {resume.personalInfo.fullName} - {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'No Date'}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the resume to use for generating the cover letter
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Company Name */}
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Google, Microsoft, Apple" 
                            {...field} 
                            data-testid="input-company-name"
                          />
                        </FormControl>
                        <FormDescription>
                          The name of the company you're applying to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Position */}
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Senior Software Engineer" 
                            {...field} 
                            data-testid="input-position"
                          />
                        </FormControl>
                        <FormDescription>
                          The job title you're applying for
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Job Description */}
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste the job description here to create a more tailored cover letter..."
                          className="min-h-[150px]"
                          {...field}
                          data-testid="textarea-job-description"
                        />
                      </FormControl>
                      <FormDescription>
                        Including the job description helps create a more personalized and relevant cover letter
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isGenerating || isLoadingResumes || resumes.length === 0}
                  data-testid="button-generate"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating 3 Variants...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Cover Letters
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Generated Cover Letter Editor */}
        {generatedCoverLetter && (
          <CoverLetterEditor
            variants={generatedCoverLetter.variants || {
              professional: generatedCoverLetter.content,
              concise: "",
              bold: "",
            }}
            companyName={generatedCoverLetter.companyName}
            position={generatedCoverLetter.position}
            onSave={handleSaveEdit}
          />
        )}

        {/* Loading State */}
        {isGenerating && (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <h3 className="text-lg font-semibold">Generating Your Cover Letters</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Creating 3 unique variants tailored to your experience and the job requirements...
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline">Professional</Badge>
                  <Badge variant="outline">Concise</Badge>
                  <Badge variant="outline">Bold</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}