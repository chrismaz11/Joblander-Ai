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

// Static data since backend is Supabase-only
export const api = {
  async getTestimonials(): Promise<Testimonial[]> {
    return [
      {
        name: "Alex Thompson",
        role: "Software Developer",
        company: "Tech Startup",
        image: "👨💻",
        quote: "JobLander streamlined my job search process significantly."
      },
      {
        name: "Sarah Chen",
        role: "Product Manager",
        company: "Fortune 500",
        image: "👩💼",
        quote: "The AI-powered resume generation saved me hours of work."
      },
      {
        name: "Mike Rodriguez",
        role: "Data Scientist",
        company: "AI Company",
        image: "👨🔬",
        quote: "Best job tracking tool I've used. Highly recommend!"
      }
    ];
  },

  async getStats(): Promise<Stats[]> {
    return [
      { value: "500+", label: "Active Users" },
      { value: "2,000+", label: "Applications Tracked" },
      { value: "15+", label: "Resume Templates" },
      { value: "Free", label: "Forever Plan" },
    ];
  }
};
