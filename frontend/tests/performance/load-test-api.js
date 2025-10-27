import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('error_rate');
const responseTime = new Trend('response_time');
const requests = new Counter('total_requests');

// Test configuration
export const options = {
  stages: [
    // Warm up
    { duration: '30s', target: 10 },
    
    // Load testing
    { duration: '2m', target: 50 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    
    // Spike testing
    { duration: '1m', target: 500 },
    { duration: '30s', target: 500 },
    
    // Cool down
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 }
  ],
  thresholds: {
    // Global thresholds
    http_req_duration: ['p(90) < 1000', 'p(95) < 2000', 'p(99) < 5000'],
    http_req_failed: ['rate < 0.05'], // Less than 5% error rate
    
    // Custom metric thresholds
    error_rate: ['rate < 0.05'],
    response_time: ['p(95) < 2000'],
    
    // Per-endpoint thresholds
    'http_req_duration{endpoint:health}': ['p(95) < 500'],
    'http_req_duration{endpoint:auth}': ['p(95) < 1500'],
    'http_req_duration{endpoint:api}': ['p(95) < 2000'],
  },
};

// Base URL - can be overridden via environment variable
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5173';

// Test data
const testUsers = [
  { email: 'test1@example.com', password: 'password123' },
  { email: 'test2@example.com', password: 'password123' },
  { email: 'test3@example.com', password: 'password123' },
];

// Helper function to get random test user
function getRandomUser() {
  return testUsers[Math.floor(Math.random() * testUsers.length)];
}

// Main test function
export default function () {
  const testScenario = Math.random();
  
  if (testScenario < 0.4) {
    // 40% - Basic health checks and static content
    testHealthAndStatic();
  } else if (testScenario < 0.7) {
    // 30% - Authentication flow
    testAuthenticationFlow();
  } else if (testScenario < 0.9) {
    // 20% - Resume operations
    testResumeOperations();
  } else {
    // 10% - Heavy operations (AI, blockchain)
    testHeavyOperations();
  }
  
  // Random sleep between 1-5 seconds to simulate user behavior
  sleep(Math.random() * 4 + 1);
}

function testHealthAndStatic() {
  const group = 'health_and_static';
  
  // Health check
  let response = http.get(`${BASE_URL}/api/health`, {
    tags: { endpoint: 'health', group }
  });
  
  check(response, {
    'health check status is 200': (r) => r.status === 200,
    'health check has status field': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.status === 'healthy';
      } catch {
        return false;
      }
    }
  });
  
  recordMetrics(response, 'health');
  
  // Homepage
  response = http.get(BASE_URL, {
    tags: { endpoint: 'homepage', group }
  });
  
  check(response, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads in reasonable time': (r) => r.timings.duration < 3000,
    'homepage contains expected content': (r) => r.body.includes('Job') || r.body.includes('Resume')
  });
  
  recordMetrics(response, 'homepage');
}

function testAuthenticationFlow() {
  const group = 'authentication';
  const user = getRandomUser();
  
  // Get auth page
  let response = http.get(`${BASE_URL}/auth`, {
    tags: { endpoint: 'auth', group }
  });
  
  check(response, {
    'auth page loads': (r) => r.status === 200,
  });
  
  recordMetrics(response, 'auth');
  
  // Simulate login attempt
  response = http.post(`${BASE_URL}/api/auth/login`, 
    JSON.stringify({
      email: user.email,
      password: user.password
    }), 
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { endpoint: 'login', group }
    }
  );
  
  const loginSuccessful = response.status === 200;
  let authToken = null;
  
  if (loginSuccessful) {
    try {
      const body = JSON.parse(response.body);
      authToken = body.token;
    } catch (e) {
      // Token extraction failed
    }
  }
  
  check(response, {
    'login request completes': (r) => r.status !== 0,
    'login response time acceptable': (r) => r.timings.duration < 2000,
  });
  
  recordMetrics(response, 'login');
  
  // If login successful, test authenticated endpoint
  if (authToken) {
    response = http.get(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      tags: { endpoint: 'me', group }
    });
    
    check(response, {
      'authenticated request works': (r) => r.status === 200 || r.status === 401,
    });
    
    recordMetrics(response, 'me');
  }
}

function testResumeOperations() {
  const group = 'resume_operations';
  
  // Get resumes list (might require auth)
  let response = http.get(`${BASE_URL}/api/resumes`, {
    tags: { endpoint: 'resumes_list', group }
  });
  
  check(response, {
    'resumes endpoint responds': (r) => r.status !== 0,
    'resumes response time acceptable': (r) => r.timings.duration < 2000,
  });
  
  recordMetrics(response, 'resumes_list');
  
  // Test resume creation (POST)
  const resumeData = {
    personalInfo: {
      name: `Test User ${Math.floor(Math.random() * 1000)}`,
      email: 'test@example.com',
      phone: '+1234567890'
    },
    experience: [],
    education: [],
    skills: ['JavaScript', 'React', 'Node.js']
  };
  
  response = http.post(`${BASE_URL}/api/resumes`,
    JSON.stringify(resumeData),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { endpoint: 'resumes_create', group }
    }
  );
  
  check(response, {
    'resume creation request completes': (r) => r.status !== 0,
    'resume creation response time acceptable': (r) => r.timings.duration < 3000,
  });
  
  recordMetrics(response, 'resumes_create');
}

function testHeavyOperations() {
  const group = 'heavy_operations';
  
  // Test LLM health (AI service)
  let response = http.get(`${BASE_URL}/api/admin/llm/health`, {
    tags: { endpoint: 'llm_health', group }
  });
  
  check(response, {
    'LLM health check responds': (r) => r.status !== 0,
    'LLM health check not too slow': (r) => r.timings.duration < 5000,
  });
  
  recordMetrics(response, 'llm_health');
  
  // Test blockchain health
  response = http.get(`${BASE_URL}/api/blockchain/health`, {
    tags: { endpoint: 'blockchain_health', group }
  });
  
  check(response, {
    'Blockchain health check responds': (r) => r.status !== 0,
    'Blockchain health check not too slow': (r) => r.timings.duration < 5000,
  });
  
  recordMetrics(response, 'blockchain_health');
  
  // Simulate job search (might be heavy)
  response = http.get(`${BASE_URL}/api/jobs?q=software+engineer&location=san+francisco`, {
    tags: { endpoint: 'job_search', group }
  });
  
  check(response, {
    'Job search responds': (r) => r.status !== 0,
    'Job search completes in reasonable time': (r) => r.timings.duration < 10000,
  });
  
  recordMetrics(response, 'job_search');
}

function recordMetrics(response, endpoint) {
  // Record custom metrics
  requests.add(1, { endpoint });
  responseTime.add(response.timings.duration, { endpoint });
  
  const isError = response.status === 0 || response.status >= 400;
  errorRate.add(isError, { endpoint });
}

// Setup function - runs once at the start
export function setup() {
  console.log(`Starting load test against: ${BASE_URL}`);
  console.log('Test configuration:');
  console.log('- Stages: Warm up → Load test → Spike test → Cool down');
  console.log('- Max concurrent users: 500');
  console.log('- Duration: ~12 minutes');
  console.log('- Test scenarios: 40% static, 30% auth, 20% resume ops, 10% heavy ops');
  
  // Verify the target is responding
  const healthCheck = http.get(`${BASE_URL}/api/health`);
  
  if (healthCheck.status !== 200) {
    console.error(`❌ Health check failed: ${healthCheck.status}`);
    console.error('Make sure the application is running and accessible');
    return null;
  }
  
  console.log('✅ Target application is responding');
  return { baseUrl: BASE_URL };
}

// Teardown function - runs once at the end
export function teardown(data) {
  console.log('Load test completed');
  console.log('Check the results above for performance metrics');
}