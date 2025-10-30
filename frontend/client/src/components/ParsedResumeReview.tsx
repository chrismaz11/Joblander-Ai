import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, AlertCircle, AlertTriangle, Edit3, Eye, ChevronDown, ChevronRight } from "lucide-react";
import { nanoid } from "nanoid";
import type { PersonalInfo, Experience, Education } from "@shared/schema";

type ConfidenceLevel = "high" | "medium" | "low";

interface ConfidenceData {
  overall: ConfidenceLevel;
  fields: {
    fullName: ConfidenceLevel;
    email: ConfidenceLevel;
    phone: ConfidenceLevel;
    location: ConfidenceLevel;
    linkedin: ConfidenceLevel;
    website: ConfidenceLevel;
    summary: ConfidenceLevel;
    experience: ConfidenceLevel;
    education: ConfidenceLevel;
    skills: ConfidenceLevel;
  };
}

interface ParsedData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  confidence?: ConfidenceData;
  rawText?: string;
}

interface ParsedResumeReviewProps {
  parsedData: ParsedData;
  onAccept: (data: ParsedData) => void;
  onEdit: (data: ParsedData) => void;
}

export function ParsedResumeReview({ parsedData, onAccept, onEdit }: ParsedResumeReviewProps) {
  const [editMode, setEditMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [localData, setLocalData] = useState<ParsedData>(parsedData);
  const [activeTab, setActiveTab] = useState("structured");

  const confidence = localData.confidence || {
    overall: "low",
    fields: {
      fullName: "low",
      email: "low",
      phone: "low",
      location: "low",
      linkedin: "low",
      website: "low",
      summary: "low",
      experience: "low",
      education: "low",
      skills: "low"
    }
  };

  const getConfidenceIcon = (level: ConfidenceLevel) => {
    switch (level) {
      case "high":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "medium":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getConfidenceColor = (level: ConfidenceLevel) => {
    switch (level) {
      case "high":
        return "border-green-500 bg-green-50 dark:bg-green-950/30";
      case "medium":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30";
      case "low":
        return "border-red-500 bg-red-50 dark:bg-red-950/30";
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setLocalData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    setLocalData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setLocalData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: nanoid(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: ""
      }]
    }));
  };

  const removeExperience = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    setLocalData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    setLocalData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: nanoid(),
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        current: false
      }]
    }));
  };

  const removeEducation = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateSkills = (skills: string[]) => {
    setLocalData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleAcceptAll = () => {
    onAccept(localData);
  };

  const handleSaveChanges = () => {
    onEdit(localData);
    setEditMode(false);
  };

  const lowConfidenceCount = Object.values(confidence.fields).filter(level => level === "low").length;
  const mediumConfidenceCount = Object.values(confidence.fields).filter(level => level === "medium").length;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header with confidence summary */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Resume Review</h2>
            <div className="flex items-center gap-4">
              <Badge variant={confidence.overall === "high" ? "default" : confidence.overall === "medium" ? "secondary" : "destructive"}>
                Overall Confidence: {confidence.overall}
              </Badge>
              {lowConfidenceCount > 0 && (
                <Badge variant="destructive" data-testid="badge-low-confidence">
                  {lowConfidenceCount} fields need review
                </Badge>
              )}
              {mediumConfidenceCount > 0 && (
                <Badge variant="secondary" data-testid="badge-medium-confidence">
                  {mediumConfidenceCount} fields may need review
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!editMode ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setEditMode(true)}
                  data-testid="button-edit-mode"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {lowConfidenceCount === 0 ? (
                  <Button onClick={handleAcceptAll} data-testid="button-accept-all">
                    Accept All
                  </Button>
                ) : (
                  <Button 
                    onClick={handleAcceptAll} 
                    variant="secondary"
                    data-testid="button-review-low-confidence"
                  >
                    Review Low Confidence
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setEditMode(false)}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges} data-testid="button-save-changes">
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="structured" data-testid="tab-structured">Structured View</TabsTrigger>
            <TabsTrigger value="raw" data-testid="tab-raw">Raw Text</TabsTrigger>
          </TabsList>

          <TabsContent value="structured" className="space-y-6">
            {/* Personal Information Section */}
            <Card className={`p-4 border-2 ${getConfidenceColor(confidence.fields.fullName)}`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    Personal Information
                    {getConfidenceIcon(confidence.fields.fullName)}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection("personal")}
                    data-testid="button-toggle-personal"
                  >
                    {expandedSections.has("personal") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>

                {(expandedSections.has("personal") || editMode) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="flex items-center gap-2">
                        Full Name
                        <Tooltip>
                          <TooltipTrigger>
                            {getConfidenceIcon(confidence.fields.fullName)}
                          </TooltipTrigger>
                          <TooltipContent>
                            Confidence: {confidence.fields.fullName}
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="fullName"
                        value={localData.personalInfo.fullName}
                        onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                        disabled={!editMode}
                        className={confidence.fields.fullName === "low" ? "border-red-500" : ""}
                        data-testid="input-review-fullname"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        Email
                        <Tooltip>
                          <TooltipTrigger>
                            {getConfidenceIcon(confidence.fields.email)}
                          </TooltipTrigger>
                          <TooltipContent>
                            Confidence: {confidence.fields.email}
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={localData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                        disabled={!editMode}
                        className={confidence.fields.email === "low" ? "border-red-500" : ""}
                        data-testid="input-review-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        Phone
                        <Tooltip>
                          <TooltipTrigger>
                            {getConfidenceIcon(confidence.fields.phone)}
                          </TooltipTrigger>
                          <TooltipContent>
                            Confidence: {confidence.fields.phone}
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="phone"
                        value={localData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                        disabled={!editMode}
                        className={confidence.fields.phone === "low" ? "border-red-500" : ""}
                        data-testid="input-review-phone"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        Location
                        <Tooltip>
                          <TooltipTrigger>
                            {getConfidenceIcon(confidence.fields.location)}
                          </TooltipTrigger>
                          <TooltipContent>
                            Confidence: {confidence.fields.location}
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="location"
                        value={localData.personalInfo.location}
                        onChange={(e) => updatePersonalInfo("location", e.target.value)}
                        disabled={!editMode}
                        className={confidence.fields.location === "low" ? "border-red-500" : ""}
                        data-testid="input-review-location"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="flex items-center gap-2">
                        LinkedIn
                        <Tooltip>
                          <TooltipTrigger>
                            {getConfidenceIcon(confidence.fields.linkedin)}
                          </TooltipTrigger>
                          <TooltipContent>
                            Confidence: {confidence.fields.linkedin}
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="linkedin"
                        value={localData.personalInfo.linkedin}
                        onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                        disabled={!editMode}
                        className={confidence.fields.linkedin === "low" ? "border-red-500" : ""}
                        data-testid="input-review-linkedin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        Website
                        <Tooltip>
                          <TooltipTrigger>
                            {getConfidenceIcon(confidence.fields.website)}
                          </TooltipTrigger>
                          <TooltipContent>
                            Confidence: {confidence.fields.website}
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="website"
                        value={localData.personalInfo.website}
                        onChange={(e) => updatePersonalInfo("website", e.target.value)}
                        disabled={!editMode}
                        className={confidence.fields.website === "low" ? "border-red-500" : ""}
                        data-testid="input-review-website"
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="summary" className="flex items-center gap-2">
                        Professional Summary
                        <Tooltip>
                          <TooltipTrigger>
                            {getConfidenceIcon(confidence.fields.summary)}
                          </TooltipTrigger>
                          <TooltipContent>
                            Confidence: {confidence.fields.summary}
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Textarea
                        id="summary"
                        value={localData.personalInfo.summary}
                        onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                        disabled={!editMode}
                        rows={4}
                        className={confidence.fields.summary === "low" ? "border-red-500" : ""}
                        data-testid="input-review-summary"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Experience Section */}
            <Card className={`p-4 border-2 ${getConfidenceColor(confidence.fields.experience)}`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    Work Experience
                    {getConfidenceIcon(confidence.fields.experience)}
                  </h3>
                  <div className="flex items-center gap-2">
                    {editMode && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addExperience}
                        data-testid="button-add-review-experience"
                      >
                        Add Experience
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("experience")}
                      data-testid="button-toggle-experience"
                    >
                      {expandedSections.has("experience") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {(expandedSections.has("experience") || editMode) && (
                  <div className="space-y-4">
                    {localData.experience.map((exp, index) => (
                      <Card key={exp.id} className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline">Experience {index + 1}</Badge>
                          {editMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(index)}
                              data-testid={`button-remove-review-exp-${index}`}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => updateExperience(index, "company", e.target.value)}
                            disabled={!editMode}
                            data-testid={`input-review-company-${index}`}
                          />
                          <Input
                            placeholder="Position"
                            value={exp.position}
                            onChange={(e) => updateExperience(index, "position", e.target.value)}
                            disabled={!editMode}
                            data-testid={`input-review-position-${index}`}
                          />
                          <Input
                            type="month"
                            placeholder="Start Date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                            disabled={!editMode}
                            data-testid={`input-review-start-${index}`}
                          />
                          <Input
                            type="month"
                            placeholder="End Date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                            disabled={!editMode || exp.current}
                            data-testid={`input-review-end-${index}`}
                          />
                        </div>
                        <Textarea
                          placeholder="Description"
                          value={exp.description}
                          onChange={(e) => updateExperience(index, "description", e.target.value)}
                          disabled={!editMode}
                          rows={3}
                          data-testid={`input-review-desc-${index}`}
                        />
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Education Section */}
            <Card className={`p-4 border-2 ${getConfidenceColor(confidence.fields.education)}`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    Education
                    {getConfidenceIcon(confidence.fields.education)}
                  </h3>
                  <div className="flex items-center gap-2">
                    {editMode && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addEducation}
                        data-testid="button-add-review-education"
                      >
                        Add Education
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("education")}
                      data-testid="button-toggle-education"
                    >
                      {expandedSections.has("education") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {(expandedSections.has("education") || editMode) && (
                  <div className="space-y-4">
                    {localData.education.map((edu, index) => (
                      <Card key={edu.id} className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline">Education {index + 1}</Badge>
                          {editMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(index)}
                              data-testid={`button-remove-review-edu-${index}`}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <Input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, "institution", e.target.value)}
                          disabled={!editMode}
                          data-testid={`input-review-institution-${index}`}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                            disabled={!editMode}
                            data-testid={`input-review-degree-${index}`}
                          />
                          <Input
                            placeholder="Field of Study"
                            value={edu.field}
                            onChange={(e) => updateEducation(index, "field", e.target.value)}
                            disabled={!editMode}
                            data-testid={`input-review-field-${index}`}
                          />
                          <Input
                            type="month"
                            placeholder="Start Date"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                            disabled={!editMode}
                            data-testid={`input-review-edu-start-${index}`}
                          />
                          <Input
                            type="month"
                            placeholder="End Date"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                            disabled={!editMode || edu.current}
                            data-testid={`input-review-edu-end-${index}`}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Skills Section */}
            <Card className={`p-4 border-2 ${getConfidenceColor(confidence.fields.skills)}`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    Skills
                    {getConfidenceIcon(confidence.fields.skills)}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection("skills")}
                    data-testid="button-toggle-skills"
                  >
                    {expandedSections.has("skills") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>

                {(expandedSections.has("skills") || editMode) && (
                  <div className="space-y-4">
                    {editMode ? (
                      <Textarea
                        value={localData.skills.join(", ")}
                        onChange={(e) => updateSkills(e.target.value.split(",").map(s => s.trim()).filter(s => s))}
                        placeholder="Enter skills separated by commas"
                        rows={3}
                        data-testid="input-review-skills"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {localData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" data-testid={`badge-review-skill-${index}`}>
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {confidence.overall === "low" && (
              <Alert className="border-red-500 bg-red-50 dark:bg-red-950/30">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  The parsing confidence is low. Please review all fields carefully and make necessary corrections.
                  You can switch to the "Raw Text" tab to see the original extracted text.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="raw" className="space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Extracted Text</h3>
                  <Badge variant="outline">Line-by-line view</Badge>
                </div>
                <ScrollArea className="h-[600px] w-full rounded border p-4">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {localData.rawText || "No raw text available"}
                  </pre>
                </ScrollArea>
                <Alert>
                  <Eye className="h-4 w-4" />
                  <AlertDescription>
                    This is the raw text extracted from your document. Use this view to verify the extraction 
                    if the structured data seems incorrect or incomplete.
                  </AlertDescription>
                </Alert>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}