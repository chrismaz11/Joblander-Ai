'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { api } from '../../../../lib/api'
import FileUpload from '../../../../components/FileUpload'

interface Resume {
  id: string
  personalInfo: any
  experience: any[]
  education: any[]
  skills: string[]
  templateId: string
  status: string
  createdAt: string
}

export default function ResumePage() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [showUpload, setShowUpload] = useState(false)

  // Form state for new resume
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: ''
    },
    experience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    education: [{
      school: '',
      degree: '',
      field: '',
      graduationDate: ''
    }],
    skills: ['']
  })

  const fetchResumes = async () => {
    try {
      setLoading(true)
      const response = await api.getResumes()
      setResumes(response.data || [])
      setError('')
    } catch (err) {
      setError('Failed to fetch resumes')
      console.error('Resumes fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchResumes()
    }
  }, [user])

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    
    try {
      const resumeData = {
        ...formData,
        userId: user?.id,
        templateId: 'template-1'
      }
      
      await api.createResume(resumeData)
      await fetchResumes()
      
      // Reset form
      setFormData({
        personalInfo: { fullName: '', email: '', phone: '', location: '' },
        experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
        education: [{ school: '', degree: '', field: '', graduationDate: '' }],
        skills: ['']
      })
      
      setError('')
    } catch (err) {
      setError('Failed to create resume')
      console.error('Resume creation error:', err)
    } finally {
      setCreating(false)
    }
  }

  const handleEnhanceResume = async (resume: Resume) => {
    try {
      setError('')
      const response = await api.enhanceResume(resume)
      
      if (response.suggestions) {
        // Show AI suggestions
        alert(`AI Suggestions:\n\n${response.suggestions.join('\n\n')}`)
      }
      
      await fetchResumes()
    } catch (err) {
      console.error('Enhancement error:', err)
      setError('Failed to enhance resume with AI')
    }
  }

  const handleDownloadPDF = async (resume: Resume) => {
    try {
      setError('')
      const response = await api.downloadResumePDF(resume.id)
      
      if (response.success) {
        // Create a blob from the HTML and download it
        const blob = new Blob([response.html], { type: 'text/html' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = response.filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (err) {
      console.error('Download error:', err)
      setError('Failed to download resume')
    }
  }

  const handleUploadSuccess = (parsedData: any) => {
    setFormData({
      personalInfo: parsedData.personalInfo || formData.personalInfo,
      experience: parsedData.experience || formData.experience,
      education: parsedData.education || formData.education,
      skills: parsedData.skills || formData.skills
    })
    setShowUpload(false)
    setError('')
  }

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to create resumes</h2>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium"
          >
            {showUpload ? 'Manual Entry' : '📤 Upload Resume'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Resume Form or Upload */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {showUpload ? 'Upload & Parse Resume' : 'Create New Resume'}
            </h2>
            
            {showUpload ? (
              <FileUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            ) : (
              <form onSubmit={handleCreateResume} className="space-y-4">
                {/* Personal Info */}
                <div>
                  <h3 className="font-medium mb-2">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.personalInfo.fullName}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, fullName: e.target.value }
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.personalInfo.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, email: e.target.value }
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={formData.personalInfo.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, phone: e.target.value }
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={formData.personalInfo.location}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalInfo: { ...formData.personalInfo, location: e.target.value }
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="font-medium mb-2">Experience</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Company"
                      value={formData.experience[0].company}
                      onChange={(e) => setFormData({
                        ...formData,
                        experience: [{ ...formData.experience[0], company: e.target.value }]
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={formData.experience[0].position}
                      onChange={(e) => setFormData({
                        ...formData,
                        experience: [{ ...formData.experience[0], position: e.target.value }]
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Description"
                      value={formData.experience[0].description}
                      onChange={(e) => setFormData({
                        ...formData,
                        experience: [{ ...formData.experience[0], description: e.target.value }]
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-medium mb-2">Skills</h3>
                  <input
                    type="text"
                    placeholder="Skills (comma separated)"
                    value={formData.skills.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Resume'}
                </button>
              </form>
            )}
          </div>

          {/* Existing Resumes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Resumes</h2>
            
            {loading ? (
              <div className="text-center py-4">Loading resumes...</div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-4 text-gray-600">
                No resumes yet. Create your first one!
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div key={resume.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">
                          {resume.personalInfo?.fullName || 'Untitled Resume'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        resume.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {resume.status}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEnhanceResume(resume)}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                      >
                        ✨ AI Enhance
                      </button>
                      <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(resume)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        📄 Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
