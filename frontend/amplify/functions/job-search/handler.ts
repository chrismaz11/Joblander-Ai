import type { APIGatewayProxyHandler } from 'aws-lambda';

interface JobSearchRequest {
  query: string;
  location?: string;
  page?: number;
  limit?: number;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  url: string;
  postedDate: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { query, location = '', page = 1, limit = 10 }: JobSearchRequest = 
      event.httpMethod === 'GET' 
        ? event.queryStringParameters || {}
        : JSON.parse(event.body || '{}');

    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Query parameter is required' }),
      };
    }

    const apiKey = process.env.JSEARCH_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'JSearch API key not configured' }),
      };
    }

    const searchParams = new URLSearchParams({
      query: query,
      page: page.toString(),
      num_pages: '1',
      date_posted: 'all',
    });

    if (location) {
      searchParams.append('location', location);
    }

    const response = await fetch(`https://jsearch.p.rapidapi.com/search?${searchParams}`, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      throw new Error(`JSearch API error: ${response.status}`);
    }

    const data = await response.json();
    
    const jobs: Job[] = (data.data || []).slice(0, limit).map((job: any) => ({
      id: job.job_id || Math.random().toString(36),
      title: job.job_title || 'Unknown Title',
      company: job.employer_name || 'Unknown Company',
      location: job.job_city && job.job_state 
        ? `${job.job_city}, ${job.job_state}` 
        : job.job_country || 'Remote',
      description: job.job_description || '',
      salary: job.job_min_salary && job.job_max_salary 
        ? `$${job.job_min_salary} - $${job.job_max_salary}` 
        : undefined,
      url: job.job_apply_link || job.job_offer_expiration_datetime_utc || '#',
      postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        jobs,
        total: data.num_results || jobs.length,
        page: parseInt(page.toString()),
        hasMore: jobs.length === limit,
      }),
    };
  } catch (error) {
    console.error('Job search error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to search jobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};
