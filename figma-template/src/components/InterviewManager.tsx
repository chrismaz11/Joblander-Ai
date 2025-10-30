import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from './ui/calendar';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Calendar as CalendarIcon, Clock, Video, MapPin, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface Interview {
  id: string;
  company: string;
  position: string;
  date: Date;
  time: string;
  type: 'phone' | 'video' | 'onsite';
  interviewer: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  prepItems?: PrepItem[];
}

interface PrepItem {
  id: string;
  task: string;
  completed: boolean;
}

export function InterviewManager() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeInterview, setActiveInterview] = useState<string | null>(null);

  const upcomingInterviews: Interview[] = [
    {
      id: '1',
      company: 'Google',
      position: 'Senior Software Engineer',
      date: new Date(2025, 10, 1),
      time: '2:00 PM',
      type: 'video',
      interviewer: 'Sarah Chen, Engineering Manager',
      status: 'upcoming',
      notes: 'Technical round focusing on system design. Review distributed systems concepts.',
      prepItems: [
        { id: '1', task: 'Review system design patterns', completed: true },
        { id: '2', task: 'Practice distributed systems questions', completed: true },
        { id: '3', task: 'Prepare questions for interviewer', completed: false },
        { id: '4', task: 'Test video setup', completed: false },
      ],
    },
    {
      id: '2',
      company: 'Meta',
      position: 'Product Engineer',
      date: new Date(2025, 10, 3),
      time: '10:00 AM',
      type: 'phone',
      interviewer: 'Michael Rodriguez, Senior Recruiter',
      status: 'upcoming',
      prepItems: [
        { id: '1', task: 'Research Meta products', completed: true },
        { id: '2', task: 'Prepare behavioral examples', completed: false },
        { id: '3', task: 'Review job description', completed: false },
      ],
    },
    {
      id: '3',
      company: 'Apple',
      position: 'iOS Engineer',
      date: new Date(2025, 10, 5),
      time: '3:00 PM',
      type: 'onsite',
      interviewer: 'Team Panel',
      status: 'upcoming',
      prepItems: [
        { id: '1', task: 'Review Swift and iOS best practices', completed: false },
        { id: '2', task: 'Prepare portfolio presentation', completed: false },
        { id: '3', task: 'Print extra copies of resume', completed: false },
        { id: '4', task: 'Plan route to office', completed: false },
      ],
    },
  ];

  const pastInterviews: Interview[] = [
    {
      id: '4',
      company: 'Stripe',
      position: 'Backend Engineer',
      date: new Date(2025, 9, 28),
      time: '11:00 AM',
      type: 'video',
      interviewer: 'Alex Kim, Tech Lead',
      status: 'completed',
      notes: 'Great conversation about payment systems. Follow up in 2-3 days.',
    },
    {
      id: '5',
      company: 'Amazon',
      position: 'Full Stack Developer',
      date: new Date(2025, 9, 25),
      time: '9:00 AM',
      type: 'phone',
      interviewer: 'Jennifer Lee, Hiring Manager',
      status: 'completed',
      notes: 'Phone screen went well. Discussed leadership principles.',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Clock className="w-4 h-4" />;
      case 'onsite':
        return <MapPin className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'phone':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'onsite':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const prepChecklist = [
    'Research the company and role thoroughly',
    'Review your resume and be ready to discuss each point',
    'Prepare STAR method examples for behavioral questions',
    'Practice common technical questions for your role',
    'Prepare thoughtful questions to ask the interviewer',
    'Test your tech setup (camera, microphone, internet)',
    'Choose appropriate attire',
    'Have a copy of your resume ready',
    'Arrive/login 5-10 minutes early',
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Interview Manager</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Schedule, prepare, and track all your interviews in one place
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stats Cards */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Upcoming</p>
              <h3 className="text-gray-900 dark:text-white">{upcomingInterviews.length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">This Week</p>
              <h3 className="text-gray-900 dark:text-white">2</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Completed</p>
              <h3 className="text-gray-900 dark:text-white">{pastInterviews.length}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar and Interviews */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="upcoming">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              <Button>
                <CalendarIcon className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
            </div>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <Card key={interview.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-900 dark:text-white">{interview.company}</h3>
                        <Badge className={getTypeColor(interview.type)}>
                          <span className="flex items-center gap-1">
                            {getTypeIcon(interview.type)}
                            {interview.type}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{interview.position}</p>
                      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {interview.date.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {interview.time}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        <span className="font-medium">With:</span> {interview.interviewer}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveInterview(activeInterview === interview.id ? null : interview.id)}
                    >
                      {activeInterview === interview.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>

                  {activeInterview === interview.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                      {interview.notes && (
                        <div>
                          <h4 className="text-gray-900 dark:text-white mb-2">Notes</h4>
                          <p className="text-gray-600 dark:text-gray-400">{interview.notes}</p>
                        </div>
                      )}

                      {interview.prepItems && (
                        <div>
                          <h4 className="text-gray-900 dark:text-white mb-3">Preparation Checklist</h4>
                          <div className="space-y-2">
                            {interview.prepItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <Checkbox checked={item.completed} />
                                <span className={`text-gray-700 dark:text-gray-300 ${item.completed ? 'line-through opacity-60' : ''}`}>
                                  {item.task}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-gray-500 dark:text-gray-500">
                            {interview.prepItems.filter(i => i.completed).length} of {interview.prepItems.length} completed
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button variant="outline" size="sm">Add Notes</Button>
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastInterviews.map((interview) => (
                <Card key={interview.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-900 dark:text-white">{interview.company}</h3>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{interview.position}</p>
                      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {interview.date.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {interview.time}
                        </span>
                      </div>
                      {interview.notes && (
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                          <p className="text-gray-600 dark:text-gray-400">{interview.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Calendar</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </Card>

          {/* General Prep Checklist */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-gray-900 dark:text-white">Interview Prep Guide</h3>
            </div>
            <div className="space-y-2">
              {prepChecklist.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">{item}</span>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-3 px-0">
              View Full Checklist
            </Button>
          </Card>

          {/* Quick Tips */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-blue-200 dark:border-blue-800">
            <h3 className="text-gray-900 dark:text-white mb-3">💡 Quick Tip</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Research shows that candidates who prepare specific examples using the STAR method perform 40% better in interviews.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
