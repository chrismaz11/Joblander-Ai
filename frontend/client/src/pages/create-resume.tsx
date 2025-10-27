import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { personalInfoSchema, experienceSchema, educationSchema, type PersonalInfo, type Experience, type Education } from "@shared/schema";
import { Upload, Sparkles, FileText, Download, Loader2, Plus, Trash2, CheckCircle, AlertTriangle, Shield } from "lucide-react";
import { nanoid } from "nanoid";
import { ParsedResumeReview } from "@/components/ParsedResumeReview";
import EnhancedTemplateSelector from '@/components/EnhancedTemplateSelector';
import { parseResumeClient } from "@/utils/parsing";

// Type for parsed resume response with confidence scores
interface ParsedResumeResponse {
  personalInfo?: PersonalInfo;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  confidence?: {
    overall: "high" | "medium" | "low";
    fields?: {
      [key: string]: "high" | "medium" | "low";
    };
  };
  id?: string;
}

export default function CreateResume() {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResumeResponse | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [parseStatus, setParseStatus] = useState<"idle" | "parsing" | "success" | "error">("idle");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [generatedCss, setGeneratedCss] = useState<string | null>(null);
  
  const { toast } = useToast();

  const steps = ["Upload", showReview ? "Review" : "Personal Info", "Experience", "Education", "Skills", "Preview"];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Personal Info Form
  const personalForm = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      summary: "",
    },
  });

  // Generate resume mutation
  const generateResumeMutation = useMutation({
    mutationFn: async () => {
      const data = {
        personalInfo: personalForm.getValues(),
        experience: experiences,
        education: educations,
        skills,
        templateId: selectedTemplate,
      };
      return apiRequest("POST", "/api/generate-resume", data);
    },
    onSuccess: (response: any) => {
      setResumeId(response.resumeRecord?.id || null);
      setGeneratedHtml(response.preview?.html || null);
      setGeneratedCss(response.preview?.css || null);
      toast({
        title: "Resume Generated!",
        description: "Your professional resume is ready to download.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate resume. Please try again.",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/msword'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.docx')) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a PDF, DOCX or TXT file.",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB.",
        });
        return;
      }

      setUploadedFile(file);
      setParseStatus("parsing");

      try {
        const parsed = await parseResumeClient(file);
        
        const adaptedData: ParsedResumeResponse = {
          personalInfo: {
            fullName: parsed.name || "",
            email: parsed.email || "",
            phone: parsed.phone || "",
            location: '',
            linkedin: '',
            website: '',
            summary: ''
          },
          experience: parsed.experience?.map(exp => ({
            id: nanoid(),
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            current: false,
            description: exp,
          })) || [],
          education: parsed.education?.map(edu => ({
            id: nanoid(),
            institution: "",
            degree: edu,
            field: "",
            startDate: "",
            endDate: "",
            current: false,
          })) || [],
          skills: parsed.skills || [],
        };

        setParseStatus("success");
        setParsedData(adaptedData);

        if (adaptedData.personalInfo) {
          personalForm.reset(adaptedData.personalInfo);
        }
        if (adaptedData.experience) {
          setExperiences(adaptedData.experience);
        }
        if (adaptedData.education) {
          setEducations(adaptedData.education);
        }
        if (adaptedData.skills) {
          setSkills(adaptedData.skills);
        }

        toast({
          title: "Resume Parsed Successfully",
          description: "Your resume has been analyzed. Review and edit the extracted information.",
        });
        setCurrentStep(1);

      } catch (error) {
        setParseStatus("error");
        toast({
          variant: "destructive",
          title: "Parse Failed",
          description: "Failed to parse resume. You can try again or enter information manually.",
        });
        setShowReview(false);
        setCurrentStep(1);
      }
    }
  };

  const handleAcceptParsedData = (data: any) => {
    // Apply the accepted data
    if (data.personalInfo) {
      personalForm.reset(data.personalInfo);
    }
    if (data.experience) {
      setExperiences(data.experience);
    }
    if (data.education) {
      setEducations(data.education);
    }
    if (data.skills) {
      setSkills(data.skills);
    }
    
    toast({
      title: "Data Accepted",
      description: "Resume data has been accepted. Continue editing if needed.",
    });
    
    setShowReview(false);
    setCurrentStep(1);
  };

  const handleEditParsedData = (data: any) => {
    // Apply the edited data
    handleAcceptParsedData(data);
  };

  const addExperience = () => {
    setExperiences([...experiences, {
      id: nanoid(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    setEducations([...educations, {
      id: nanoid(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
    }]);
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setEducations(educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    setEducations(educations.filter(edu => edu.id !== id));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Your Resume</h1>
          <p className="text-xl text-muted-foreground">
            Upload your existing resume or create a new one from scratch
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-muted-foreground">{steps[currentStep]}</span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-resume" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div>
            <Card className="p-6">
              {/* Step 0: Upload */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
                    <p className="text-muted-foreground mb-6">
                      Upload an existing resume for AI parsing, or skip to create from scratch
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover-elevate transition-all">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="resume-upload"
                      data-testid="input-resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">
                        {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PDF, DOC, or DOCX (max 10MB)
                      </p>
                    </label>
                  </div>

                  {parseStatus === "parsing" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3 text-primary">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>AI is analyzing your resume...</span>
                      </div>
                      <Progress value={33} className="h-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        Extracting text and assessing confidence levels...
                      </p>
                    </div>
                  )}
                  
                  {parseStatus === "error" && (
                    <Alert className="border-red-500">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Failed to parse your resume. You can try uploading again or proceed to manual entry.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="w-full"
                    data-testid="button-skip-upload"
                  >
                    Skip and Create Manually
                  </Button>
                </div>
              )}

              {/* Step 1: Review Parsed Data (if confidence scores available) */}
              {currentStep === 1 && showReview && parsedData && parsedData.personalInfo && (
                <ParsedResumeReview
                  parsedData={{
                    personalInfo: parsedData.personalInfo,
                    experience: parsedData.experience || [],
                    education: parsedData.education || [],
                    skills: parsedData.skills || [],
                    confidence: parsedData.confidence as any,
                  }}
                  onAccept={handleAcceptParsedData}
                  onEdit={handleEditParsedData}
                />
              )}

              {/* Step 1: Personal Info (manual entry or after review) */}
              {currentStep === 1 && !showReview && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        {...personalForm.register("fullName")}
                        data-testid="input-fullname"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...personalForm.register("email")}
                          data-testid="input-email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          {...personalForm.register("phone")}
                          data-testid="input-phone"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        {...personalForm.register("location")}
                        data-testid="input-location"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          {...personalForm.register("linkedin")}
                          data-testid="input-linkedin"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          {...personalForm.register("website")}
                          data-testid="input-website"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        {...personalForm.register("summary")}
                        rows={4}
                        data-testid="input-summary"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setCurrentStep(0)}
                      variant="outline"
                      className="flex-1"
                      data-testid="button-back-personal"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                      data-testid="button-next-personal"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Experience */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Work Experience</h2>
                    <Button onClick={addExperience} size="sm" data-testid="button-add-experience">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-6 max-h-96 overflow-y-auto">
                    {experiences.map((exp, index) => (
                      <Card key={exp.id} className="p-4 space-y-4" data-testid={`card-experience-${index}`}>
                        <div className="flex justify-between items-start">
                          <Badge variant="outline">Experience {index + 1}</Badge>
                          <Button
                            onClick={() => removeExperience(exp.id)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            data-testid={`button-remove-experience-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            data-testid={`input-company-${index}`}
                          />
                          <Input
                            placeholder="Position"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                            data-testid={`input-position-${index}`}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            type="month"
                            placeholder="Start Date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                            data-testid={`input-start-date-${index}`}
                          />
                          <Input
                            type="month"
                            placeholder="End Date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                            disabled={exp.current}
                            data-testid={`input-end-date-${index}`}
                          />
                        </div>

                        <Textarea
                          placeholder="Description"
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                          rows={3}
                          data-testid={`input-description-${index}`}
                        />
                      </Card>
                    ))}
                  </div>

                  {experiences.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No experience added yet. Click "Add" to get started.
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="flex-1"
                      data-testid="button-back-experience"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1"
                      data-testid="button-next-experience"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Education */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Education</h2>
                    <Button onClick={addEducation} size="sm" data-testid="button-add-education">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-6 max-h-96 overflow-y-auto">
                    {educations.map((edu, index) => (
                      <Card key={edu.id} className="p-4 space-y-4" data-testid={`card-education-${index}`}>
                        <div className="flex justify-between items-start">
                          <Badge variant="outline">Education {index + 1}</Badge>
                          <Button
                            onClick={() => removeEducation(edu.id)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            data-testid={`button-remove-education-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <Input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                          data-testid={`input-institution-${index}`}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                            data-testid={`input-degree-${index}`}
                          />
                          <Input
                            placeholder="Field of Study"
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                            data-testid={`input-field-${index}`}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            type="month"
                            placeholder="Start Date"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                            data-testid={`input-edu-start-${index}`}
                          />
                          <Input
                            type="month"
                            placeholder="End Date"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                            disabled={edu.current}
                            data-testid={`input-edu-end-${index}`}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>

                  {educations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No education added yet. Click "Add" to get started.
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      variant="outline"
                      className="flex-1"
                      data-testid="button-back-education"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(4)}
                      className="flex-1"
                      data-testid="button-next-education"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Skills */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Skills</h2>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      data-testid="input-skill"
                    />
                    <Button onClick={addSkill} data-testid="button-add-skill">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 gap-2"
                        data-testid={`badge-skill-${index}`}
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(index)}
                          className="hover:text-destructive"
                          data-testid={`button-remove-skill-${index}`}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {skills.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No skills added yet. Add your skills above.
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setCurrentStep(3)}
                      variant="outline"
                      className="flex-1"
                      data-testid="button-back-skills"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(5)}
                      className="flex-1"
                      data-testid="button-next-skills"
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Preview */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Preview & Generate</h2>

                  <Button
                    onClick={() => generateResumeMutation.mutate()}
                    disabled={generateResumeMutation.isPending}
                    className="w-full"
                    data-testid="button-generate-resume"
                  >
                    {generateResumeMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Resume
                      </>
                    )}
                  </Button>

                  {resumeId && (
                    <div className="space-y-4">
                      <Card className="p-6 bg-chart-3/10 border-chart-3/20">
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle className="h-6 w-6 text-chart-3" />
                          <h3 className="text-lg font-bold">Resume Generated!</h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Your resume is ready. Download it or verify on blockchain.
                        </p>
                        <div className="flex gap-2">
                          <Button className="flex-1" data-testid="button-download-resume">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                          <Button variant="outline" className="flex-1" data-testid="button-verify-resume">
                            <Shield className="h-4 w-4 mr-2" />
                            Verify
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}

                  <Button
                    onClick={() => setCurrentStep(4)}
                    variant="outline"
                    className="w-full"
                    data-testid="button-back-preview"
                  >
                    Back
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Right Side - Preview */}
          <div>
            <EnhancedTemplateSelector parsedData={parsedData} />
          </div>
        </div>
      </div>
    </div>
  );
}
