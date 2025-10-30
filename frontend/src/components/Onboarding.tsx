import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight, Sparkles, Target, Briefcase, TrendingUp } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState({
    // Step 1: Profile
    fullName: '',
    currentTitle: '',
    yearsExperience: '',
    // Step 2: Goals
    jobSearchGoal: [] as string[],
    targetRole: '',
    targetSalary: '',
    // Step 3: Preferences
    jobTypes: [] as string[],
    locations: [] as string[],
    // Step 4: Import
    hasResume: false,
    linkedinUrl: '',
  });

  const progress = (currentStep / totalSteps) * 100;

  const jobSearchGoals = [
    { id: 'actively-searching', label: 'Actively searching for a new role', icon: '🎯' },
    { id: 'passively-looking', label: 'Open to opportunities', icon: '👀' },
    { id: 'career-change', label: 'Planning a career change', icon: '🔄' },
    { id: 'first-job', label: 'Looking for my first job', icon: '🚀' },
  ];

  const jobTypes = [
    { id: 'full-time', label: 'Full-time' },
    { id: 'part-time', label: 'Part-time' },
    { id: 'contract', label: 'Contract' },
    { id: 'remote', label: 'Remote' },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleArrayValue = (array: string[], value: string) => {
    if (array.includes(value)) {
      return array.filter(item => item !== value);
    }
    return [...array, value];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-gray-900 dark:text-white">JobLander</h1>
          </div>
          <h2 className="text-gray-900 dark:text-white mb-2">Welcome to JobLander! 👋</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Let's set up your profile to personalize your job search experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-gray-600 dark:text-gray-400">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="p-8 mb-6">
          {/* Step 1: Profile Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-gray-900 dark:text-white mb-2">Tell us about yourself</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Help us understand your professional background
                </p>
              </div>

              <div className="space-y-4">
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
                  <Label htmlFor="currentTitle">Current/Most Recent Job Title *</Label>
                  <Input
                    id="currentTitle"
                    placeholder="e.g., Software Engineer"
                    value={formData.currentTitle}
                    onChange={(e) => setFormData({ ...formData, currentTitle: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  <select
                    id="yearsExperience"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                  >
                    <option value="">Select...</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-gray-900 dark:text-white mb-2">What are your goals?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This helps us tailor your experience
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Job Search Status (Select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {jobSearchGoals.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            jobSearchGoal: toggleArrayValue(formData.jobSearchGoal, goal.id),
                          })
                        }
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.jobSearchGoal.includes(goal.id)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{goal.icon}</span>
                          <div className="flex-1">
                            <span className="text-gray-900 dark:text-white block">{goal.label}</span>
                          </div>
                          {formData.jobSearchGoal.includes(goal.id) && (
                            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetRole">Target Role</Label>
                    <Input
                      id="targetRole"
                      placeholder="e.g., Senior Software Engineer"
                      value={formData.targetRole}
                      onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetSalary">Target Salary (Optional)</Label>
                    <Input
                      id="targetSalary"
                      placeholder="e.g., $120,000"
                      value={formData.targetSalary}
                      onChange={(e) => setFormData({ ...formData, targetSalary: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-gray-900 dark:text-white mb-2">Your preferences</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  What type of opportunities are you looking for?
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Employment Type (Select all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {jobTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            jobTypes: toggleArrayValue(formData.jobTypes, type.id),
                          })
                        }
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          formData.jobTypes.includes(type.id)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        {type.label}
                        {formData.jobTypes.includes(type.id) && (
                          <CheckCircle2 className="w-4 h-4 inline ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locations">Preferred Locations</Label>
                  <Input
                    id="locations"
                    placeholder="e.g., San Francisco, Remote, New York"
                    onChange={(e) => {
                      const locs = e.target.value.split(',').map(l => l.trim()).filter(l => l);
                      setFormData({ ...formData, locations: locs });
                    }}
                  />
                  <p className="text-gray-500 dark:text-gray-500">
                    Separate multiple locations with commas
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Import Data */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-gray-900 dark:text-white mb-2">Almost done! 🎉</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Import your existing data to get started faster
                </p>
              </div>

              <div className="space-y-6">
                <Card className="p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                  <h4 className="text-gray-900 dark:text-white mb-3">Import from LinkedIn</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Connect your LinkedIn profile to automatically import your work history and skills.
                  </p>
                  <div className="space-y-3">
                    <Input
                      placeholder="LinkedIn Profile URL (optional)"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    />
                    <Button variant="outline" className="w-full">
                      Import from LinkedIn
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800">
                  <h4 className="text-gray-900 dark:text-white mb-3">Upload Your Resume</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Upload an existing resume and we'll use it as a starting point.
                  </p>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-purple-400 dark:hover:border-purple-600 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-gray-900 dark:text-white mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-gray-500 dark:text-gray-500">
                      PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </div>
                </Card>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <Checkbox
                    id="skip"
                    checked={!formData.hasResume}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasResume: !checked })}
                  />
                  <label htmlFor="skip" className="text-gray-700 dark:text-gray-300 cursor-pointer">
                    Skip for now, I'll do this later
                  </label>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index + 1 === currentStep
                    ? 'w-8 bg-blue-600'
                    : index + 1 < currentStep
                    ? 'bg-blue-600'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <Button onClick={handleNext}>
            {currentStep === totalSteps ? (
              <>
                Complete Setup
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Skip Link */}
        {currentStep < totalSteps && (
          <div className="text-center mt-4">
            <button
              onClick={onComplete}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Skip onboarding
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
