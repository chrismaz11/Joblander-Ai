import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

import AIAssistancePanel from "./AIAssistancePanel";

export default function ResumeEditor({ resume, onSave, onCancel, isSaving }) {
  const defaultResume = {
    title: "New Resume",
    template_id: "modern",
    enhanced_content: {
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
      certifications: [],
      projects: [],
    },
  };

  const [editedResume, setEditedResume] = useState(resume || defaultResume);

  const handleSave = async () => {
    if (onSave) {
      onSave(editedResume);
    }
  };

  const updateField = (path, value) => {
    const newResume = { ...editedResume };
    const keys = path.split(".");
    let current = newResume;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setEditedResume(newResume);
  };

  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      location: "",
      bullets: [""],
    };
    updateField("enhanced_content.experience", [
      ...(editedResume.enhanced_content?.experience || []),
      newExperience,
    ]);
  };

  const removeExperience = (index) => {
    const experiences = [...(editedResume.enhanced_content?.experience || [])];
    experiences.splice(index, 1);
    updateField("enhanced_content.experience", experiences);
  };

  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };
    updateField("enhanced_content.education", [
      ...(editedResume.enhanced_content?.education || []),
      newEducation,
    ]);
  };

  const removeEducation = (index) => {
    const education = [...(editedResume.enhanced_content?.education || [])];
    education.splice(index, 1);
    updateField("enhanced_content.education", education);
  };

  const addBullet = (expIndex) => {
    const experiences = [...(editedResume.enhanced_content?.experience || [])];
    if (experiences[expIndex]) {
      experiences[expIndex].bullets = [...(experiences[expIndex].bullets || []), ""];
      updateField("enhanced_content.experience", experiences);
    }
  };

  const removeBullet = (expIndex, bulletIndex) => {
    const experiences = [...(editedResume.enhanced_content?.experience || [])];
    if (experiences[expIndex]) {
      experiences[expIndex].bullets.splice(bulletIndex, 1);
      updateField("enhanced_content.experience", experiences);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-none shadow-2xl">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onCancel && (
                  <Button variant="ghost" size="icon" onClick={onCancel}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}
                <div>
                  <CardTitle className="text-2xl">{editedResume.title || "New Resume"}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Edit and enhance your resume</p>
                </div>
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-2">
              <Label htmlFor="title">Resume Title *</Label>
              <Input
                id="title"
                value={editedResume.title || ""}
                onChange={(e) => setEditedResume({ ...editedResume, title: e.target.value })}
                placeholder="e.g., Software Engineer Resume - 2024"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={editedResume.enhanced_content?.personal_info?.full_name || ""}
                    onChange={(e) =>
                      updateField("enhanced_content.personal_info.full_name", e.target.value)
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={editedResume.enhanced_content?.personal_info?.email || ""}
                    onChange={(e) => updateField("enhanced_content.personal_info.email", e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editedResume.enhanced_content?.personal_info?.phone || ""}
                    onChange={(e) => updateField("enhanced_content.personal_info.phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={editedResume.enhanced_content?.personal_info?.location || ""}
                    onChange={(e) =>
                      updateField("enhanced_content.personal_info.location", e.target.value)
                    }
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input
                    value={editedResume.enhanced_content?.personal_info?.linkedin || ""}
                    onChange={(e) =>
                      updateField("enhanced_content.personal_info.linkedin", e.target.value)
                    }
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={editedResume.enhanced_content?.personal_info?.website || ""}
                    onChange={(e) =>
                      updateField("enhanced_content.personal_info.website", e.target.value)
                    }
                    placeholder="johndoe.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                Professional Summary
              </h3>
              <Textarea
                value={editedResume.enhanced_content?.summary || ""}
                onChange={(e) => updateField("enhanced_content.summary", e.target.value)}
                rows={4}
                placeholder="Write a compelling summary that highlights your key strengths and career objectives..."
              />
              <p className="text-xs text-gray-500">
                💡 Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  Work Experience
                </h3>
                <Button onClick={addExperience} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              {(editedResume.enhanced_content?.experience || []).length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-500 mb-3">No work experience added yet</p>
                  <Button onClick={addExperience} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Job
                  </Button>
                </div>
              )}
              {(editedResume.enhanced_content?.experience || []).map((exp, index) => (
                <Card key={index} className="p-4 border border-gray-200 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Position {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Company Name"
                      value={exp.company || ""}
                      onChange={(e) => {
                        const experiences = [...editedResume.enhanced_content.experience];
                        experiences[index].company = e.target.value;
                        updateField("enhanced_content.experience", experiences);
                      }}
                    />
                    <Input
                      placeholder="Job Title"
                      value={exp.position || ""}
                      onChange={(e) => {
                        const experiences = [...editedResume.enhanced_content.experience];
                        experiences[index].position = e.target.value;
                        updateField("enhanced_content.experience", experiences);
                      }}
                    />
                    <Input
                      placeholder="Start Date (e.g., Jan 2020)"
                      value={exp.start_date || ""}
                      onChange={(e) => {
                        const experiences = [...editedResume.enhanced_content.experience];
                        experiences[index].start_date = e.target.value;
                        updateField("enhanced_content.experience", experiences);
                      }}
                    />
                    <Input
                      placeholder="End Date (or 'Present')"
                      value={exp.end_date || ""}
                      onChange={(e) => {
                        const experiences = [...editedResume.enhanced_content.experience];
                        experiences[index].end_date = e.target.value;
                        updateField("enhanced_content.experience", experiences);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Achievements & Responsibilities</Label>
                      <Button variant="ghost" size="sm" onClick={() => addBullet(index)}>
                        <Plus className="w-3 h-3 mr-1" />
                        Add Bullet
                      </Button>
                    </div>
                    {(exp.bullets || []).map((bullet, bIndex) => (
                      <div key={bIndex} className="flex gap-2">
                        <Textarea
                          value={bullet}
                          onChange={(e) => {
                            const experiences = [...editedResume.enhanced_content.experience];
                            experiences[index].bullets[bIndex] = e.target.value;
                            updateField("enhanced_content.experience", experiences);
                          }}
                          rows={2}
                          placeholder="• Describe your achievement with quantifiable results..."
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBullet(index, bIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {(!exp.bullets || exp.bullets.length === 0) && (
                      <Button variant="outline" size="sm" onClick={() => addBullet(index)} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Achievement
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 font-bold">4</span>
                  </div>
                  Education
                </h3>
                <Button onClick={addEducation} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>
              {(editedResume.enhanced_content?.education || []).length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-500 mb-3">No education added yet</p>
                  <Button onClick={addEducation} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              )}
              {(editedResume.enhanced_content?.education || []).map((edu, index) => (
                <Card key={index} className="p-4 border border-gray-200 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Education {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="University Name"
                      value={edu.institution || ""}
                      onChange={(e) => {
                        const education = [...editedResume.enhanced_content.education];
                        education[index].institution = e.target.value;
                        updateField("enhanced_content.education", education);
                      }}
                    />
                    <Input
                      placeholder="Degree (e.g., Bachelor of Science)"
                      value={edu.degree || ""}
                      onChange={(e) => {
                        const education = [...editedResume.enhanced_content.education];
                        education[index].degree = e.target.value;
                        updateField("enhanced_content.education", education);
                      }}
                    />
                    <Input
                      placeholder="Field of Study"
                      value={edu.field || ""}
                      onChange={(e) => {
                        const education = [...editedResume.enhanced_content.education];
                        education[index].field = e.target.value;
                        updateField("enhanced_content.education", education);
                      }}
                    />
                    <Input
                      placeholder="Graduation Date"
                      value={edu.graduation_date || ""}
                      onChange={(e) => {
                        const education = [...editedResume.enhanced_content.education];
                        education[index].graduation_date = e.target.value;
                        updateField("enhanced_content.education", education);
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-bold">5</span>
                </div>
                Skills
              </h3>
              <Textarea
                value={(editedResume.enhanced_content?.skills || []).join(", ")}
                onChange={(e) =>
                  updateField(
                    "enhanced_content.skills",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s),
                  )
                }
                rows={3}
                placeholder="JavaScript, React, Node.js, Python, SQL, Git..."
              />
              <p className="text-xs text-gray-500">
                💡 Tip: Separate skills with commas. Include both technical and soft skills.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-4">
          <AIAssistancePanel
            resumeData={editedResume}
            onApplySuggestion={(suggestion) => {
              console.log("Apply suggestion:", suggestion);
            }}
          />
        </div>
      </div>
    </div>
  );
}
