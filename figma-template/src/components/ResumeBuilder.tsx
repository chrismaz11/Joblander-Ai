import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

type Step = 1 | 2 | 3 | 4;

export function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    // Experience
    experiences: [{ company: '', position: '', duration: '', description: '' }],
    // Education
    education: [{ school: '', degree: '', year: '', gpa: '' }],
    // Skills
    skills: '',
  });

  const steps = [
    { number: 1, title: 'Personal Info', icon: '👤' },
    { number: 2, title: 'Experience', icon: '💼' },
    { number: 3, title: 'Education', icon: '🎓' },
    { number: 4, title: 'Skills & Review', icon: '⚡' },
  ];

  const progress = (currentStep / 4) * 100;

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, { company: '', position: '', duration: '', description: '' }]
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { school: '', degree: '', year: '', gpa: '' }]
    });
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep((currentStep + 1) as Step);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Resume Builder</h1>
        <p className="text-gray-600 dark:text-gray-400">Create a professional resume in minutes</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex-1 flex items-center ${step.number !== steps.length ? 'after:flex-1 after:h-0.5 after:mx-4' : ''} ${
                step.number <= currentStep
                  ? 'after:bg-indigo-600 dark:after:bg-indigo-400'
                  : 'after:bg-gray-200 dark:after:bg-gray-700'
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                    step.number <= currentStep
                      ? 'bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500 text-white'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>
                <p className={`mt-2 ${step.number <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                  {step.title}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-2 p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-gray-900 dark:text-white">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    placeholder="linkedin.com/in/johndoe"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio Website</Label>
                  <Input
                    id="portfolio"
                    placeholder="johndoe.com"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900 dark:text-white">Work Experience</h3>
                <Button variant="outline" onClick={addExperience}>Add Experience</Button>
              </div>
              {formData.experiences.map((exp, index) => (
                <Card key={index} className="p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company *</Label>
                        <Input placeholder="Google" />
                      </div>
                      <div className="space-y-2">
                        <Label>Position *</Label>
                        <Input placeholder="Software Engineer" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Duration *</Label>
                        <Input placeholder="Jan 2020 - Present" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Describe your responsibilities and achievements..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900 dark:text-white">Education</h3>
                <Button variant="outline" onClick={addEducation}>Add Education</Button>
              </div>
              {formData.education.map((edu, index) => (
                <Card key={index} className="p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>School *</Label>
                        <Input placeholder="Stanford University" />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree *</Label>
                        <Input placeholder="Bachelor of Science in Computer Science" />
                      </div>
                      <div className="space-y-2">
                        <Label>Year *</Label>
                        <Input placeholder="2016 - 2020" />
                      </div>
                      <div className="space-y-2">
                        <Label>GPA (Optional)</Label>
                        <Input placeholder="3.8/4.0" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-gray-900 dark:text-white">Skills & Technologies</h3>
              <div className="space-y-2">
                <Label>Enter your skills (comma separated)</Label>
                <Textarea
                  placeholder="React, TypeScript, Node.js, Python, AWS, Docker..."
                  rows={6}
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-blue-900 dark:text-blue-200">AI Resume Enhancement Available</p>
                    <p className="text-blue-700 dark:text-blue-300 mt-1">Our AI can help optimize your resume content for better ATS compatibility and impact.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            {currentStep === 4 ? (
              <Button>
                Generate Resume
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next Step
              </Button>
            )}
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6 sticky top-8 self-start">
          <h3 className="text-gray-900 dark:text-white mb-4">Resume Preview</h3>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4 shadow-sm">
            <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-gray-900 dark:text-white mb-1">
                {formData.fullName || 'Your Name'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {formData.email || 'your.email@example.com'}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {formData.phone || '+1 (555) 123-4567'}
              </p>
            </div>

            <div>
              <h4 className="text-gray-900 dark:text-white mb-2">Experience</h4>
              <div className="space-y-3">
                {formData.experiences.map((exp, index) => (
                  <div key={index} className="text-gray-600 dark:text-gray-400">
                    <p>{exp.company || 'Company Name'}</p>
                    <p>{exp.position || 'Position'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 dark:text-white mb-2">Education</h4>
              <div className="space-y-3">
                {formData.education.map((edu, index) => (
                  <div key={index} className="text-gray-600 dark:text-gray-400">
                    <p>{edu.school || 'School Name'}</p>
                    <p>{edu.degree || 'Degree'}</p>
                  </div>
                ))}
              </div>
            </div>

            {formData.skills && (
              <div>
                <h4 className="text-gray-900 dark:text-white mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-400 rounded"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
