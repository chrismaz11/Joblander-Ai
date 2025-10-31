import { useState } from 'react';
import { Card } from './ui/card';

type JobStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';

interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  salary: string;
  status: JobStatus;
  appliedDate?: string;
  notes?: string;
}

export function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([
    { id: '1', company: 'Google', position: 'Senior Software Engineer', location: 'Mountain View, CA', salary: '$180k - $250k', status: 'interview', appliedDate: 'Oct 25, 2025' },
    { id: '2', company: 'Meta', position: 'Frontend Developer', location: 'Menlo Park, CA', salary: '$160k - $220k', status: 'applied', appliedDate: 'Oct 27, 2025' },
    { id: '3', company: 'Apple', position: 'iOS Engineer', location: 'Cupertino, CA', salary: '$170k - $240k', status: 'offer', appliedDate: 'Oct 20, 2025' },
    { id: '4', company: 'Netflix', position: 'Full Stack Engineer', location: 'Los Gatos, CA', salary: '$190k - $280k', status: 'wishlist' },
    { id: '5', company: 'TechCorp', position: 'Backend Engineer', location: 'Seattle, WA', salary: '$150k - $210k', status: 'interview', appliedDate: 'Oct 22, 2025' },
    { id: '6', company: 'Microsoft', position: 'Cloud Engineer', location: 'Redmond, WA', salary: '$155k - $215k', status: 'rejected', appliedDate: 'Oct 18, 2025' },
    { id: '7', company: 'Stripe', position: 'Backend Engineer', location: 'San Francisco, CA', salary: '$175k - $245k', status: 'wishlist' },
    { id: '8', company: 'Airbnb', position: 'Product Engineer', location: 'San Francisco, CA', salary: '$165k - $230k', status: 'applied', appliedDate: 'Oct 26, 2025' },
  ]);

  const columns: { id: JobStatus; title: string; color: string }[] = [
    { id: 'wishlist', title: 'Wishlist', color: 'border-gray-300 dark:border-gray-600' },
    { id: 'applied', title: 'Applied', color: 'border-yellow-300 dark:border-yellow-600' },
    { id: 'interview', title: 'Interview', color: 'border-blue-300 dark:border-blue-600' },
    { id: 'offer', title: 'Offer', color: 'border-green-300 dark:border-green-600' },
    { id: 'rejected', title: 'Rejected', color: 'border-red-300 dark:border-red-600' },
  ];

  const handleDragStart = (e: React.DragEvent, jobId: string) => {
    e.dataTransfer.setData('jobId', jobId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: JobStatus) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: newStatus, appliedDate: newStatus !== 'wishlist' && !job.appliedDate ? new Date().toLocaleDateString() : job.appliedDate }
        : job
    ));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h1 className="text-gray-900 dark:text-white mb-2">Job Board</h1>
        <p className="text-gray-600 dark:text-gray-400">Drag and drop jobs to track your application progress</p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="p-8 min-w-max">
          <div className="grid grid-cols-5 gap-4">
            {columns.map((column) => (
              <div
                key={column.id}
                className="flex flex-col min-h-[600px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className={`border-t-4 ${column.color} bg-white dark:bg-gray-800 rounded-t-lg p-4 mb-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-900 dark:text-white">{column.title}</h3>
                    <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {jobs.filter(job => job.status === column.id).length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  {jobs
                    .filter(job => job.status === column.id)
                    .map((job) => (
                      <Card
                        key={job.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, job.id)}
                        className="p-4 cursor-move hover:shadow-lg transition-shadow"
                      >
                        <h4 className="text-gray-900 dark:text-white mb-1">{job.company}</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{job.position}</p>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{job.salary}</span>
                          </div>
                        </div>

                        {job.appliedDate && (
                          <p className="text-gray-500 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-2">
                            Applied: {job.appliedDate}
                          </p>
                        )}
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
