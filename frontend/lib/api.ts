import { supabase } from './supabase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

class ApiClient {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession()
    return {
      'Content-Type': 'application/json',
      ...(session?.access_token && {
        'Authorization': `Bearer ${session.access_token}`
      })
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Jobs API
  async getJobs(params?: { query?: string; location?: string; salary?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.query) searchParams.set('query', params.query)
    if (params?.location) searchParams.set('location', params.location)
    if (params?.salary) searchParams.set('salary', params.salary)
    
    const queryString = searchParams.toString()
    return this.request(`/api/jobs${queryString ? `?${queryString}` : ''}`)
  }

  async getJobStats() {
    return this.request('/api/jobs/stats')
  }

  // Resumes API
  async createResume(resumeData: any) {
    return this.request('/api/resumes', {
      method: 'POST',
      body: JSON.stringify(resumeData),
    })
  }

  async getResumes() {
    return this.request('/api/resumes')
  }

  async getResume(id: string) {
    return this.request(`/api/resumes/${id}`)
  }

  async updateResume(id: string, resumeData: any) {
    return this.request(`/api/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resumeData),
    })
  }

  async enhanceResume(resumeData: any) {
    return this.request('/api/resumes/enhance', {
      method: 'POST',
      body: JSON.stringify(resumeData),
    })
  }

  async downloadResumePDF(resumeId: string, templateId?: string) {
    return this.request(`/api/resumes/${resumeId}/pdf`, {
      method: 'POST',
      body: JSON.stringify({ templateId: templateId || 'template-1' }),
    })
  }

  // Resume parsing
  async parseResume(file: File) {
    const formData = new FormData()
    formData.append('resume', file)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    return fetch(`${API_BASE_URL}/api/parse-resume`, {
      method: 'POST',
      headers: {
        ...(session?.access_token && {
          'Authorization': `Bearer ${session.access_token}`
        })
      },
      body: formData,
    }).then(res => res.json())
  }

  // Templates
  async getTemplates() {
    return this.request('/api/templates')
  }

  async renderResume(resumeId: string, templateId: string) {
    return this.request('/api/resumes/render', {
      method: 'POST',
      body: JSON.stringify({ resumeId, templateId }),
    })
  }
}

export const api = new ApiClient()
