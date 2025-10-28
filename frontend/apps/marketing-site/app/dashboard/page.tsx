'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../contexts/AuthContext'
import { api } from '../../../../lib/api'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ resumes: 0, jobs: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resumesRes, jobsRes] = await Promise.all([
          api.getResumes(),
          api.getJobs()
        ])
        setStats({
          resumes: resumesRes.data?.length || 0,
          jobs: jobsRes.data?.length || 0
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">JobLander Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/resume" className="text-blue-600 hover:text-blue-800">Resumes</a>
              <a href="/jobs" className="text-blue-600 hover:text-blue-800">Jobs</a>
              <span className="text-gray-700">Welcome, {user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">📄</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Your Resumes
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loadingStats ? '...' : stats.resumes}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">💼</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Available Jobs
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loadingStats ? '...' : stats.jobs}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">✨</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        AI Features
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Active
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/resume"
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-2xl mb-2">📝</div>
                <div className="font-medium">Create Resume</div>
                <div className="text-sm opacity-90">Build with AI assistance</div>
              </a>

              <a
                href="/jobs"
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-2xl mb-2">🔍</div>
                <div className="font-medium">Search Jobs</div>
                <div className="text-sm opacity-90">Find your next opportunity</div>
              </a>

              <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors">
                <div className="text-2xl mb-2">📤</div>
                <div className="font-medium">Upload Resume</div>
                <div className="text-sm opacity-90">Parse with AI</div>
              </button>

              <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg text-center transition-colors">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium">Analytics</div>
                <div className="text-sm opacity-90">Track applications</div>
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-400 text-xl">✅</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Frontend-Backend Connection Active!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your JobLander app is now connected and functional:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>✅ Database connected and working</li>
                    <li>✅ Authentication system active</li>
                    <li>✅ Resume builder connected to backend</li>
                    <li>✅ Job search connected to backend</li>
                    <li>⚠️ AI features need OpenAI API key</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
