'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { api } from '../../../../lib/api'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  description: string
  remote: boolean
  employmentType: string
  postedDate: string
}

export default function JobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('')

  const fetchJobs = async (query?: string, location?: string) => {
    try {
      setLoading(true)
      const response = await api.getJobs({ query, location })
      setJobs(response.data || [])
      setError('')
    } catch (err) {
      setError('Failed to fetch jobs')
      console.error('Jobs fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs(searchQuery, searchLocation)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to search jobs</h2>
          <a href="/login" className="text-blue-600 hover:text-blue-800">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Search</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title or Keywords
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search Jobs'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Jobs List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-lg">Loading jobs...</div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">No jobs found</div>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-lg text-gray-700">{job.company}</p>
                    <p className="text-gray-600">
                      {job.location} {job.remote && '• Remote'}
                    </p>
                  </div>
                  <div className="text-right">
                    {job.salary && (
                      <p className="text-lg font-semibold text-green-600">{job.salary}</p>
                    )}
                    <p className="text-sm text-gray-500">{job.employmentType}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {job.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Posted: {new Date(job.postedDate).toLocaleDateString()}
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
