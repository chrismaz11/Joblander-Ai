import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  LayoutTemplate, 
  Download, 
  Eye,
  Edit3,
  Plus,
  Save
} from "lucide-react";

type ResumeTemplate = {
  id: string;
  name: string;
  preview: string;
  category: string;
};

const templates: ResumeTemplate[] = [
  { id: "minimal", name: "Minimal", preview: "/templates/minimal.png", category: "Modern" },
  { id: "professional", name: "Professional", preview: "/templates/professional.png", category: "Classic" },
  { id: "creative", name: "Creative", preview: "/templates/creative.png", category: "Design" },
  { id: "modern", name: "Modern", preview: "/templates/modern.png", category: "Modern" },
];

export default function ResumeBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("minimal");
  const [isEditing, setIsEditing] = useState(false);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "John Doe",
      title: "Software Engineer",
      email: "john@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA"
    },
    summary: "Experienced software engineer with 5+ years building scalable web applications.",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Corp",
        location: "San Francisco, CA",
        start: "2022",
        end: "Present",
        highlights: [
          "Led development of microservices architecture",
          "Improved system performance by 40%",
          "Mentored junior developers"
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of California",
        location: "Berkeley, CA",
        year: "2019"
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS"]
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleSave = () => {
    console.log("Saving resume...", resumeData);
    // TODO: Save to backend
  };

  const handleExportPDF = () => {
    console.log("Exporting PDF...");
    // TODO: Generate PDF
  };

  const handlePreview = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
            <Badge variant="secondary">Draft</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePreview}>
              {isEditing ? <Eye className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
              {isEditing ? "Preview" : "Edit"}
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Templates & Tools */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <LayoutTemplate className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Templates</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent className="p-3">
                    <div className="aspect-[3/4] bg-gray-100 rounded mb-2 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-center">{template.name}</p>
                    <p className="text-xs text-gray-500 text-center">{template.category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {isEditing && (
              <div className="mt-8">
                <h3 className="text-md font-semibold mb-4">Edit Sections</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skills
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Resume Preview/Editor */}
        <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8">
                {/* Resume Content */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center border-b pb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {resumeData.personalInfo.fullName}
                    </h1>
                    <p className="text-xl text-gray-600 mb-4">
                      {resumeData.personalInfo.title}
                    </p>
                    <div className="flex justify-center gap-4 text-sm text-gray-500">
                      <span>{resumeData.personalInfo.email}</span>
                      <span>•</span>
                      <span>{resumeData.personalInfo.phone}</span>
                      <span>•</span>
                      <span>{resumeData.personalInfo.location}</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
                  </div>

                  {/* Experience */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Experience</h2>
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="mb-6 last:mb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                            <p className="text-gray-600">{exp.company} • {exp.location}</p>
                          </div>
                          <span className="text-sm text-gray-500">{exp.start} - {exp.end}</span>
                        </div>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {exp.highlights.map((highlight, i) => (
                            <li key={i}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Education */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                            <p className="text-gray-600">{edu.institution} • {edu.location}</p>
                          </div>
                          <span className="text-sm text-gray-500">{edu.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
