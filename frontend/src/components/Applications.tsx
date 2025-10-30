import { useState } from 'react';
import { Card } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';

interface Application {
  id: string;
  company: string;
  position: string;
  location: string;
  salary: string;
  status: string;
  appliedDate: string;
  lastUpdate: string;
  priority: 'high' | 'medium' | 'low';
}

export function Applications() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const applications: Application[] = [
    {
      id: '1',
      company: 'Google',
      position: 'Senior Software Engineer',
      location: 'Mountain View, CA',
      salary: '$180k - $250k',
      status: 'Interview',
      appliedDate: 'Oct 25, 2025',
      lastUpdate: '2 days ago',
      priority: 'high',
    },
    {
      id: '2',
      company: 'Meta',
      position: 'Frontend Developer',
      location: 'Menlo Park, CA',
      salary: '$160k - $220k',
      status: 'Applied',
      appliedDate: 'Oct 27, 2025',
      lastUpdate: '1 day ago',
      priority: 'high',
    },
    {
      id: '3',
      company: 'Apple',
      position: 'iOS Engineer',
      location: 'Cupertino, CA',
      salary: '$170k - $240k',
      status: 'Offer',
      appliedDate: 'Oct 20, 2025',
      lastUpdate: '3 days ago',
      priority: 'high',
    },
    {
      id: '4',
      company: 'Amazon',
      position: 'Backend Engineer',
      location: 'Seattle, WA',
      salary: '$150k - $210k',
      status: 'Interview',
      appliedDate: 'Oct 22, 2025',
      lastUpdate: '4 days ago',
      priority: 'medium',
    },
    {
      id: '5',
      company: 'Microsoft',
      position: 'Cloud Engineer',
      location: 'Redmond, WA',
      salary: '$155k - $215k',
      status: 'Rejected',
      appliedDate: 'Oct 18, 2025',
      lastUpdate: '1 week ago',
      priority: 'low',
    },
    {
      id: '6',
      company: 'Stripe',
      position: 'Backend Engineer',
      location: 'San Francisco, CA',
      salary: '$175k - $245k',
      status: 'Applied',
      appliedDate: 'Oct 28, 2025',
      lastUpdate: '3 hours ago',
      priority: 'high',
    },
    {
      id: '7',
      company: 'Airbnb',
      position: 'Product Engineer',
      location: 'San Francisco, CA',
      salary: '$165k - $230k',
      status: 'Phone Screen',
      appliedDate: 'Oct 26, 2025',
      lastUpdate: '2 days ago',
      priority: 'medium',
    },
    {
      id: '8',
      company: 'Netflix',
      position: 'Full Stack Engineer',
      location: 'Los Gatos, CA',
      salary: '$190k - $280k',
      status: 'Applied',
      appliedDate: 'Oct 29, 2025',
      lastUpdate: '1 hour ago',
      priority: 'high',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Offer':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Interview':
      case 'Phone Screen':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Applied':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Applications</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and track all your job applications</p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by company or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="phone screen">Phone Screen</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Application
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Priority</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <svg 
                    className={`w-5 h-5 ${getPriorityColor(app.priority)}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2L3 7l7 5 7-5-7-5z" />
                    <path d="M3 12l7 5 7-5M3 17l7 5 7-5" opacity={app.priority === 'high' ? 1 : app.priority === 'medium' ? 0.6 : 0.3} />
                  </svg>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {app.company[0]}
                    </div>
                    <span className="text-gray-900 dark:text-white">{app.company}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-900 dark:text-white">{app.position}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{app.location}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{app.salary}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{app.appliedDate}</TableCell>
                <TableCell className="text-gray-500 dark:text-gray-500">{app.lastUpdate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
