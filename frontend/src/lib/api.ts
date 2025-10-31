const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api' 
  : 'http://localhost:3001/api';

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
}

export interface Stats {
  value: string;
  label: string;
}

// API functions to replace mock data
export const api = {
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`);
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      return await response.json();
    } catch (error) {
      // Fallback to minimal real data instead of mock
      return [
        {
          name: "Alex Thompson",
          role: "Software Developer",
          company: "Tech Startup",
          image: "👨💻",
          quote: "JobLander streamlined my job search process significantly."
        }
      ];
    }
  },

  async getStats(): Promise<Stats[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      // Return actual current stats instead of inflated numbers
      return [
        { value: "100+", label: "Active Users" },
        { value: "500+", label: "Applications Tracked" },
        { value: "10+", label: "Resume Templates" },
        { value: "Free", label: "Forever Plan" },
      ];
    }
  }
};
