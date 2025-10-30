import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink,
  FileText,
  MessageSquare,
  Calendar,
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

interface JobDetailsProps {
  onBack: () => void;
}

export function JobDetails({ onBack }: JobDetailsProps) {
  const [currentStatus, setCurrentStatus] = useState('interview');

  const job = {
    id: '1',
    company: 'Google',
    position: 'Senior Software Engineer',
    location: 'Mountain View, CA',
    salary: '$180,000 - $250,000',
    type: 'Full-time',
    posted: '2 weeks ago',
    appliedDate: 'Oct 25, 2025',
    status: 'Interview',
    priority: 'High',
    jobUrl: 'https://careers.google.com/jobs/123',
    description: `We're looking for a Senior Software Engineer to join our core infrastructure team. You'll work on building scalable systems that power Google's products used by billions of users worldwide.

Key Responsibilities:
• Design and implement large-scale distributed systems
• Collaborate with cross-functional teams to deliver high-impact projects
• Mentor junior engineers and contribute to engineering culture
• Optimize system performance and reliability

Requirements:
• 5+ years of software engineering experience
• Strong proficiency in one or more: Go, Java, C++, Python
• Experience with distributed systems and microservices
• Bachelor's degree in Computer Science or related field`,
    requirements: [
      '5+ years of software engineering experience',
      'Strong proficiency in Go, Java, C++, or Python',
      'Experience with distributed systems',
      'Excellent problem-solving skills',
    ],
  };

  const timeline = [
    {
      date: 'Oct 30, 2025',
      title: 'Technical Interview Scheduled',
      description: 'System design round with Sarah Chen',
      type: 'interview',
    },
    {
      date: 'Oct 28, 2025',
      title: 'Recruiter Phone Screen',
      description: 'Initial conversation went well. Discussed role expectations.',
      type: 'completed',
    },
    {
      date: 'Oct 25, 2025',
      title: 'Application Submitted',
      description: 'Resume and cover letter sent through company portal',
      type: 'completed',
    },
    {
      date: 'Oct 23, 2025',
      title: 'Job Posted',
      description: 'Found on LinkedIn',
      type: 'completed',
    },
  ];

  const documents = [
    { name: 'Resume_Google_Senior_SWE.pdf', size: '156 KB', date: 'Oct 25, 2025' },
    { name: 'Cover_Letter_Google.pdf', size: '84 KB', date: 'Oct 25, 2025' },
    { name: 'Portfolio_Link.txt', size: '2 KB', date: 'Oct 25, 2025' },
  ];

  const notes = [
    {
      date: 'Oct 28, 2025',
      content: 'Recruiter mentioned strong focus on system design and scalability. Team is working on improving search infrastructure.',
    },
    {
      date: 'Oct 26, 2025',
      content: 'Researched team - they recently published a paper on distributed caching. Should review before interview.',
    },
  ];

  const statusOptions = [
    { value: 'wishlist', label: 'Wishlist', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
    { value: 'applied', label: 'Applied', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
    { value: 'phone-screen', label: 'Phone Screen', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
    { value: 'interview', label: 'Interview', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
    { value: 'offer', label: 'Offer', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
  ];

  const getCurrentStatusColor = () => {
    const status = statusOptions.find(s => s.value === currentStatus);
    return status?.color || statusOptions[0].color;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-gray-900 dark:text-white">{job.position}</h1>
              <Badge className={getCurrentStatusColor()}>
                {statusOptions.find(s => s.value === currentStatus)?.label}
              </Badge>
              <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
                {job.priority} Priority
              </Badge>
            </div>
            <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {job.company}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {job.salary}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Applied {job.appliedDate}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" className="text-red-600 dark:text-red-400">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Update */}
          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status.value}
                  variant={currentStatus === status.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentStatus(status.value)}
                  className={currentStatus === status.value ? '' : ''}
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Job Details</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-gray-900 dark:text-white mb-3">Job Description</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-gray-900 dark:text-white mb-3">Key Requirements</h3>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Original Job Posting
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card className="p-6">
                <h3 className="text-gray-900 dark:text-white mb-6">Application Timeline</h3>
                <div className="space-y-6">
                  {timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.type === 'interview' 
                            ? 'bg-blue-100 dark:bg-blue-900/20' 
                            : 'bg-green-100 dark:bg-green-900/20'
                        }`}>
                          {event.type === 'interview' ? (
                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-700 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-gray-900 dark:text-white">{event.title}</h4>
                          <span className="text-gray-500 dark:text-gray-500">{event.date}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Add Timeline Event
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900 dark:text-white">Documents</h3>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white">{doc.name}</p>
                          <p className="text-gray-500 dark:text-gray-500">
                            {doc.size} • {doc.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card className="p-6">
                <h3 className="text-gray-900 dark:text-white mb-4">Notes</h3>
                <div className="space-y-4 mb-6">
                  {notes.map((note, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 dark:text-gray-500">{note.date}</span>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{note.content}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <Textarea placeholder="Add a new note..." rows={4} />
                  <Button>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Generate Resume
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Follow-up
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                Company Research
              </Button>
            </div>
          </Card>

          {/* Job Info */}
          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Job Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 dark:text-gray-500 mb-1">Employment Type</p>
                <p className="text-gray-900 dark:text-white">{job.type}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-500 mb-1">Posted</p>
                <p className="text-gray-900 dark:text-white">{job.posted}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-500 mb-1">Application Date</p>
                <p className="text-gray-900 dark:text-white">{job.appliedDate}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-500 mb-1">Source</p>
                <p className="text-gray-900 dark:text-white">LinkedIn</p>
              </div>
            </div>
          </Card>

          {/* Contacts */}
          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Contacts</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  SC
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white">Sarah Chen</p>
                  <p className="text-gray-500 dark:text-gray-500">Recruiter</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                Add Contact
              </Button>
            </div>
          </Card>

          {/* Reminders */}
          <Card className="p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-gray-900 dark:text-white mb-1">Upcoming Interview</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Technical interview tomorrow at 2:00 PM
                </p>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
