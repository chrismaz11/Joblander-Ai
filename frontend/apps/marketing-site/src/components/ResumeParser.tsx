import { useState, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Edit, Download } from 'lucide-react';

interface ParsedResume {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    graduationDate: string;
    gpa?: string;
    honors?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
    certifications: string[];
  };
  rawText?: string;
}

interface ResumeParserProps {
  onParsed: (data: ParsedResume) => void;
  onSkip?: () => void;
}

export function ResumeParser({ onParsed, onSkip }: ResumeParserProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const parseResume = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate parsing progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // In production, this would call your backend API
      // which uses a resume parsing service like:
      // - Affinda API
      // - Sovren
      // - HireAbility
      // - Or custom OpenAI implementation
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock parsed data (replace with actual API call)
      const mockParsedData: ParsedResume = {
        personalInfo: {
          fullName: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedIn: 'linkedin.com/in/johndoe',
          portfolio: 'johndoe.com',
        },
        summary: 'Experienced software engineer with 5+ years building scalable web applications. Specializes in React, Node.js, and cloud architecture.',
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            startDate: '2021-03',
            endDate: 'Present',
            current: true,
            description: 'Lead development of customer-facing web applications',
            achievements: [
              'Reduced page load time by 40% through optimization',
              'Mentored 3 junior developers',
              'Led migration to microservices architecture'
            ],
          },
          {
            title: 'Software Engineer',
            company: 'StartUp Inc',
            location: 'Remote',
            startDate: '2019-01',
            endDate: '2021-02',
            current: false,
            description: 'Built and maintained core product features',
            achievements: [
              'Developed RESTful APIs serving 10K+ users',
              'Implemented CI/CD pipeline',
              'Reduced bug rate by 30%'
            ],
          },
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of California',
            location: 'Berkeley, CA',
            graduationDate: '2018-05',
            gpa: '3.8',
            honors: 'Magna Cum Laude',
          },
        ],
        skills: {
          technical: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
          soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration'],
          languages: ['English (Native)', 'Spanish (Professional)'],
          certifications: ['AWS Certified Solutions Architect', 'Google Cloud Professional'],
        },
      };

      clearInterval(progressInterval);
      setProgress(100);
      setParsedData(mockParsedData);
      
    } catch (err) {
      setError('Failed to parse resume. Please try again or contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (parsedData) {
      onParsed(parsedData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!parsedData ? (
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-gray-900 dark:text-white mb-2">Parse Your Resume</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your resume and we'll extract all your information automatically using AI
            </p>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-700 dark:text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {!file ? (
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                  : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
              }`}
              onClick={() => document.getElementById('resume-upload')?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 dark:text-white mb-2">
                Drop your resume here or click to browse
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Supports PDF, DOC, DOCX, TXT (Max 5MB)
              </p>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                {!isProcessing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              {isProcessing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Parsing resume...
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {progress}%
                    </span>
                  </div>
                  <Progress value={progress} />
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    {progress < 30 && 'Reading file...'}
                    {progress >= 30 && progress < 60 && 'Extracting text...'}
                    {progress >= 60 && progress < 90 && 'Analyzing content with AI...'}
                    {progress >= 90 && 'Finalizing...'}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={parseResume}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Parsing...' : 'Parse Resume'}
                </Button>
                {onSkip && (
                  <Button variant="outline" onClick={onSkip}>
                    Skip
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-900 dark:text-white mb-4">What we extract:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">Contact information</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">Work experience</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">Education history</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">Skills & certifications</span>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              Resume parsed successfully! Review the information below and make any necessary corrections.
            </AlertDescription>
          </Alert>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 dark:text-white">Parsed Information</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h4 className="text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  Personal Information
                  <Badge variant="outline" className="text-green-600 dark:text-green-400">
                    Verified
                  </Badge>
                </h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="text-gray-900 dark:text-white">{parsedData.personalInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white">{parsedData.personalInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-gray-900 dark:text-white">{parsedData.personalInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-gray-900 dark:text-white">{parsedData.personalInfo.location}</p>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h4 className="text-gray-900 dark:text-white mb-3">
                  Work Experience ({parsedData.experience.length} positions)
                </h4>
                <div className="space-y-3">
                  {parsedData.experience.map((exp, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-gray-900 dark:text-white">{exp.title}</p>
                          <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                        </div>
                        {exp.current && (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-500 dark:text-gray-500">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-gray-900 dark:text-white mb-3">
                  Skills ({parsedData.skills.technical.length} found)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.technical.map((skill, idx) => (
                    <Badge key={idx} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleConfirm} className="flex-1">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm & Continue
            </Button>
            <Button variant="outline" onClick={() => setParsedData(null)}>
              Parse Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
