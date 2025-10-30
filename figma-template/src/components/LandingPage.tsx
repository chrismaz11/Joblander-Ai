import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Check, Sparkles, TrendingUp, Calendar, FileText, BarChart3, Zap, Shield, Users } from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignup: () => void;
}

export function LandingPage({ onNavigateToLogin, onNavigateToSignup }: LandingPageProps) {
  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'AI-Powered Resumes',
      description: 'Generate tailored resumes for each application using advanced AI technology.',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Application Tracking',
      description: 'Organize and track all your job applications in one intuitive kanban board.',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Interview Manager',
      description: 'Never miss an interview with our scheduling and preparation tools.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Success Analytics',
      description: 'Data-driven insights to optimize your job search strategy.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Quick Apply',
      description: 'Apply to multiple positions faster with saved templates and autofill.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared with third parties.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '5 AI resume generations/month',
        'Up to 10 active applications',
        'Basic analytics',
        'Email support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$19',
      period: 'per month',
      description: 'For serious job seekers',
      features: [
        'Unlimited AI resume generations',
        'Unlimited applications',
        'Advanced analytics & insights',
        'Interview prep tools',
        'Priority email support',
        'Custom resume templates',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: 'per month',
      description: 'For career professionals',
      features: [
        'Everything in Professional',
        'Career coaching sessions',
        'LinkedIn optimization',
        'Salary negotiation tools',
        '24/7 priority support',
        'Custom integrations',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'Google',
      image: '👩‍💻',
      quote: 'JobLander helped me land my dream role at Google in just 6 weeks. The AI resume feature is a game-changer!',
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'Meta',
      image: '👨‍💼',
      quote: 'The analytics gave me insights I never had before. I improved my response rate by 45% in one month.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      company: 'Apple',
      image: '👩‍🎨',
      quote: 'Finally, a tool that actually helps organize the chaos of job searching. Highly recommended!',
    },
  ];

  const stats = [
    { value: '2,500+', label: 'Active Users' },
    { value: '15,000+', label: 'Applications Tracked' },
    { value: '10+', label: 'Resume Templates' },
    { value: 'Free', label: 'Forever Plan' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900 dark:text-white">JobLander</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Testimonials
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onNavigateToLogin}>
                Sign In
              </Button>
              <Button onClick={onNavigateToSignup}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-600/5 dark:via-purple-600/5 dark:to-pink-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              🚀 Now with AI-Powered Resume Generation
            </Badge>
            <h1 className="text-gray-900 dark:text-white mb-6 text-4xl lg:text-6xl">
              Land Your Dream Job
              <span className="block text-gradient">Faster Than Ever</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg lg:text-xl max-w-2xl mx-auto">
              JobLander helps you organize applications, generate AI-powered resumes, and track your job search with powerful analytics. Join 50,000+ successful job seekers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={onNavigateToSignup}>
                Start Free Trial
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-blue-600 dark:text-blue-400 mb-2 text-3xl lg:text-4xl">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-gray-900 dark:text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful tools designed to streamline your job search and maximize your success rate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Pricing</Badge>
            <h2 className="text-gray-900 dark:text-white mb-4">
              Choose your plan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include core features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`p-8 relative ${
                  tier.popular
                    ? 'border-2 border-blue-500 shadow-xl scale-105'
                    : ''
                }`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className="text-gray-900 dark:text-white mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-gray-900 dark:text-white text-4xl">{tier.price}</span>
                    <span className="text-gray-500 dark:text-gray-400">/{tier.period}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    tier.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : ''
                  }`}
                  variant={tier.popular ? 'default' : 'outline'}
                  onClick={onNavigateToSignup}
                >
                  {tier.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-gray-900 dark:text-white mb-4">
              Loved by job seekers everywhere
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of successful professionals who landed their dream jobs with JobLander.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">"{testimonial.quote}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4">
            Ready to land your dream job?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join 50,000+ professionals who are already using JobLander to accelerate their career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={onNavigateToSignup}>
              Start Free Trial
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-white">JobLander</span>
            </div>
            <p>© 2025 JobLander. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
