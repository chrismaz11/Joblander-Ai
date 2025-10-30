import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock,
  Bookmark,
  ExternalLink,
  Filter,
  TrendingUp,
  Building2
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  remote: boolean;
  postedDate: string;
  description: string;
  source: 'linkedin' | 'indeed' | 'glassdoor' | 'jsearch';
  url: string;
  logo?: string;
}

export function JobSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('all');
  const [remote, setRemote] = useState('all');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  // Mock job data - in production, this would come from integrated APIs
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      salary: '$180,000 - $250,000',
      type: 'Full-time',
      remote: true,
      postedDate: '2 days ago',
      description: 'We\'re looking for a Senior Software Engineer to join our core infrastructure team...',
      source: 'linkedin',
      url: 'https://linkedin.com/jobs/123',
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'Meta',
      location: 'Remote',
      salary: '$150,000 - $200,000',
      type: 'Full-time',
      remote: true,
      postedDate: '1 day ago',
      description: 'Join our team building the next generation of social experiences...',
      source: 'indeed',
      url: 'https://indeed.com/jobs/456',
    },
    {
      id: '3',
      title: 'Product Manager',
      company: 'Apple',
      location: 'Cupertino, CA',
      salary: '$160,000 - $220,000',
      type: 'Full-time',
      remote: false,
      postedDate: '3 days ago',
      description: 'Looking for a Product Manager to lead our consumer products division...',
      source: 'glassdoor',
      url: 'https://glassdoor.com/jobs/789',
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'Amazon',
      location: 'Seattle, WA',
      salary: '$140,000 - $190,000',
      type: 'Full-time',
      remote: true,
      postedDate: '1 week ago',
      description: 'Join AWS team to build and maintain cloud infrastructure...',
      source: 'jsearch',
      url: 'https://amazon.jobs/321',
    },
    {
      id: '5',
      title: 'UX Designer',
      company: 'Airbnb',
      location: 'San Francisco, CA',
      salary: '$130,000 - $180,000',
      type: 'Full-time',
      remote: true,
      postedDate: '4 days ago',
      description: 'Design delightful experiences for millions of users worldwide...',
      source: 'linkedin',
      url: 'https://linkedin.com/jobs/567',
    },
    {
      id: '6',
      title: 'Data Scientist',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      salary: '$170,000 - $240,000',
      type: 'Full-time',
      remote: true,
      postedDate: '5 days ago',
      description: 'Use machine learning to personalize content recommendations...',
      source: 'indeed',
      url: 'https://indeed.com/jobs/890',
    },
  ];

  const getSourceBadge = (source: string) => {
    const styles = {
      linkedin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      indeed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
      glassdoor: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      jsearch: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    };
    return styles[source as keyof typeof styles];
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApply = (job: Job) => {
    // In production, this would navigate to application page or open external link
    console.log('Applying to:', job.title);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Job Search</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Search across LinkedIn, Indeed, Glassdoor, and more job boards in one place
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="City, state, or remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              <Search className="w-4 h-4 mr-2" />
              Search Jobs
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>

          <Select value={remote} onValueChange={setRemote}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="remote">Remote Only</SelectItem>
              <SelectItem value="onsite">On-site Only</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>

          <div className="flex-1"></div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">Sort by:</span>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date Posted</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Job Boards</h3>
            <div className="space-y-2">
              {[
                { name: 'LinkedIn', count: 1234, color: 'bg-blue-500' },
                { name: 'Indeed', count: 892, color: 'bg-purple-500' },
                { name: 'Glassdoor', count: 567, color: 'bg-green-500' },
                { name: 'JSearch', count: 423, color: 'bg-orange-500' },
              ].map((board) => (
                <div key={board.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${board.color}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">{board.name}</span>
                  </div>
                  <Badge variant="outline">{board.count}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Salary Range</h3>
            <div className="space-y-2">
              {['$50k+', '$100k+', '$150k+', '$200k+'].map((range) => (
                <div key={range} className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700 dark:text-gray-300">{range}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-blue-200 dark:border-blue-800">
            <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="text-gray-900 dark:text-white mb-2">Job Market Insights</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Software Engineer roles have increased 23% this month
            </p>
            <Button variant="outline" size="sm">
              View Trends
            </Button>
          </Card>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">
                  All Jobs ({jobs.length})
                </TabsTrigger>
                <TabsTrigger value="saved">
                  Saved ({savedJobs.length})
                </TabsTrigger>
                <TabsTrigger value="applied">
                  Applied (0)
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-gray-900 dark:text-white">{job.title}</h3>
                          {job.remote && (
                            <Badge variant="outline" className="text-green-600 dark:text-green-400">
                              Remote
                            </Badge>
                          )}
                          <Badge className={getSourceBadge(job.source)}>
                            {job.source}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{job.company}</p>
                        
                        <div className="flex flex-wrap gap-4 text-gray-500 dark:text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          {job.salary && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.salary}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.postedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSaveJob(job.id)}
                      className={savedJobs.includes(job.id) ? 'text-blue-600 dark:text-blue-400' : ''}
                    >
                      <Bookmark className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex gap-2">
                    <Button onClick={() => handleApply(job)} className="flex-1">
                      Quick Apply
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={job.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on {job.source}
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="saved">
              {savedJobs.length === 0 ? (
                <Card className="p-12 text-center">
                  <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-gray-900 dark:text-white mb-2">No saved jobs yet</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click the bookmark icon on any job to save it for later
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {jobs.filter(job => savedJobs.includes(job.id)).map((job) => (
                    <Card key={job.id} className="p-6">
                      {/* Same job card content */}
                      <h3 className="text-gray-900 dark:text-white mb-2">{job.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="applied">
              <Card className="p-12 text-center">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 dark:text-white mb-2">No applications yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Jobs you apply to will appear here
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
