import { http, HttpResponse } from 'msw';

// Mock data
export const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  verified: true,
};

export const mockResume = {
  id: 'resume-123',
  userId: 'test-user-123',
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    location: 'New York, NY',
  },
  experience: [
    {
      id: 'exp-1',
      title: 'Software Engineer',
      company: 'Tech Corp',
      startDate: '2022-01-01',
      endDate: '2023-12-31',
      description: 'Developed web applications using React and Node.js',
      current: false,
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      school: 'University of Technology',
      startDate: '2018-09-01',
      endDate: '2022-05-31',
      gpa: '3.8',
    }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
  templateId: 'template-1',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-12-31T23:59:59Z',
};

export const mockJobs = [
  {
    id: 'job-1',
    title: 'Frontend Developer',
    company: 'Startup Inc',
    location: 'San Francisco, CA',
    salary: '$80,000 - $120,000',
    description: 'We are looking for a frontend developer...',
    requirements: ['React', 'JavaScript', 'CSS'],
    postedDate: '2024-01-15',
    matchScore: 85,
  },
  {
    id: 'job-2',
    title: 'Full Stack Engineer',
    company: 'Big Tech',
    location: 'Seattle, WA',
    salary: '$100,000 - $150,000',
    description: 'Join our engineering team...',
    requirements: ['React', 'Node.js', 'AWS'],
    postedDate: '2024-01-10',
    matchScore: 92,
  }
];

export const mockBlockchainResponse = {
  transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  blockchainHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  verificationUrl: 'https://mumbai.polygonscan.com/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  timestamp: Date.now(),
  gasUsed: '21000',
};

// API Handlers
export const handlers = [
  // Authentication endpoints
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as any;
    
    if (!body.email || !body.password) {
      return HttpResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    return HttpResponse.json({
      user: { ...mockUser, email: body.email },
      token: 'mock-jwt-token'
    });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as any;
    
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        user: mockUser,
        token: 'mock-jwt-token'
      });
    }
    
    return HttpResponse.json({ 
      error: 'Invalid credentials' 
    }, { status: 401 });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 });
    }
    
    return HttpResponse.json({ user: mockUser });
  }),

  // Resume endpoints
  http.get('/api/resumes', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (userId === mockUser.id) {
      return HttpResponse.json([mockResume]);
    }
    
    return HttpResponse.json([]);
  }),

  http.get('/api/resumes/:id', ({ params }) => {
    if (params.id === mockResume.id) {
      return HttpResponse.json(mockResume);
    }
    
    return HttpResponse.json({ 
      error: 'Resume not found' 
    }, { status: 404 });
  }),

  http.post('/api/resumes', async ({ request }) => {
    const body = await request.json() as any;
    
    return HttpResponse.json({
      ...mockResume,
      ...body,
      id: 'resume-new-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }),

  http.put('/api/resumes/:id', async ({ params, request }) => {
    const body = await request.json() as any;
    
    if (params.id === mockResume.id) {
      return HttpResponse.json({
        ...mockResume,
        ...body,
        updatedAt: new Date().toISOString(),
      });
    }
    
    return HttpResponse.json({ 
      error: 'Resume not found' 
    }, { status: 404 });
  }),

  http.delete('/api/resumes/:id', ({ params }) => {
    if (params.id === mockResume.id) {
      return HttpResponse.json({ success: true });
    }
    
    return HttpResponse.json({ 
      error: 'Resume not found' 
    }, { status: 404 });
  }),

  // Resume parsing endpoint
  http.post('/api/parse-resume', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return HttpResponse.json({ 
        error: 'No file uploaded' 
      }, { status: 400 });
    }
    
    // Simulate parsing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return HttpResponse.json({
      ...mockResume,
      id: 'parsed-resume-' + Date.now(),
      fileName: file.name,
      fileSize: file.size,
      parsedAt: new Date().toISOString(),
    });
  }),

  // AI enhancement endpoints
  http.post('/api/enhance-resume', async ({ request }) => {
    const body = await request.json() as any;
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return HttpResponse.json({
      ...body,
      enhanced: true,
      enhancedAt: new Date().toISOString(),
      improvements: [
        'Added action verbs to experience descriptions',
        'Improved skill categorization',
        'Enhanced professional summary'
      ]
    });
  }),

  // Job search endpoints
  http.get('/api/jobs', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const location = url.searchParams.get('location');
    
    let filteredJobs = mockJobs;
    
    if (query) {
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    return HttpResponse.json({
      jobs: filteredJobs,
      total: filteredJobs.length,
      page: 1,
      limit: 10,
    });
  }),

  // Cover letter generation
  http.post('/api/generate-cover-letter', async ({ request }) => {
    const body = await request.json() as any;
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return HttpResponse.json({
      coverLetter: `Dear Hiring Manager,\n\nI am writing to express my interest in the ${body.jobTitle || 'position'} at ${body.company || 'your company'}. With my experience in software development and passion for technology, I believe I would be a great fit for your team.\n\nBest regards,\n${mockUser.name}`,
      tone: body.tone || 'professional',
      generatedAt: new Date().toISOString(),
    });
  }),

  // Blockchain verification
  http.post('/api/verify-on-chain', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return HttpResponse.json({ 
        error: 'No file uploaded' 
      }, { status: 400 });
    }
    
    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return HttpResponse.json(mockBlockchainResponse);
  }),

  // Health check endpoints
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '4.0.0',
      services: {
        database: 'connected',
        ai: 'operational',
        blockchain: 'operational',
      }
    });
  }),

  http.get('/api/admin/llm/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      provider: 'gemini',
      model: 'gemini-pro',
      tokensUsed: 12500,
      requestsToday: 45,
      cacheHitRate: 0.78,
    });
  }),

  http.get('/api/blockchain/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      network: 'polygon-mumbai',
      walletAddress: '0x742d35Cc6634C0532925a3b8D0aF9F62e9e1b2A5',
      blockHeight: 45123456,
      gasPrice: '20',
      balance: '0.5',
    });
  }),

  // Error simulation endpoints for testing
  http.get('/api/test/error', () => {
    return HttpResponse.json({ 
      error: 'Test error' 
    }, { status: 500 });
  }),

  http.get('/api/test/timeout', () => {
    // Simulate timeout
    return new Promise(() => {}); // Never resolves
  }),

  // Fallback for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`);
    return HttpResponse.json({ 
      error: 'Not found' 
    }, { status: 404 });
  }),
];