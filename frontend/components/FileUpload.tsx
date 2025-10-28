'use client'

import { useState } from 'react'
import { api } from '../lib/api'

interface FileUploadProps {
  onUploadSuccess: (data: any) => void
  onUploadError: (error: string) => void
}

export default function FileUpload({ onUploadSuccess, onUploadError }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]

    if (!allowedTypes.includes(file.type)) {
      onUploadError('Please upload a PDF, Word document, or text file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      onUploadError('File size must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      const response = await api.parseResume(file)
      
      if (response.success) {
        onUploadSuccess(response.data)
      } else {
        onUploadError(response.error || 'Failed to parse resume')
      }
    } catch (error) {
      onUploadError('Upload failed. Please try again.')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
      >
        {uploading ? (
          <div className="space-y-2">
            <div className="text-2xl">⏳</div>
            <div className="text-lg font-medium">Parsing resume with AI...</div>
            <div className="text-sm text-gray-600">This may take a few seconds</div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">📄</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload your resume
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your resume here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, Word documents, and text files (max 5MB)
              </p>
            </div>
            
            <div>
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="resume-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                Choose File
              </label>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <span className="text-green-500">✨</span>
          <span>AI-powered parsing extracts your information automatically</span>
        </div>
      </div>
    </div>
  )
}
