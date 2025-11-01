import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Get started with AI-powered job hunting',
    features: [
      '2 AI resume generations/month',
      '3 cover letter generations/month',
      'Basic templates',
      'Job search (manual refresh)',
      'Basic ATS scoring',
      'Community support'
    ],
    popular: false,
    tier: 'free'
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 19.95,
    priceId: 'price_pro_monthly',
    description: 'Unlock full AI guidance and automation',
    features: [
      'Unlimited AI resume generations',
      'Unlimited cover letter generations',
      'Premium templates',
      'AI job matching with daily alerts',
      'Advanced ATS optimization',
      'Interview prep with AI feedback',
      'Salary negotiation tools',
      'Priority support'
    ],
    popular: true,
    tier: 'pro'
  },
  {
    id: 'enterprise',
    name: 'Professional',
    price: 9.95,
    priceId: 'price_professional_monthly',
    description: 'For serious professionals',
    features: ['Unlimited resumes', 'Premium templates', 'Cover letters', 'Priority support'],
    popular: false,
    tier: 'professional'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29.95,
    priceId: 'price_enterprise_monthly',
    description: 'For teams and organizations',
    features: ['Everything in Pro', 'Team management', 'API access', 'Custom branding'],
    popular: false,
    tier: 'enterprise'
  }
];

export default function Pricing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!user) return;
    
    setLoading(plan.id);
    
    try {
      // Mock subscription flow for now
      console.log('Subscribing to:', plan.name);
      setTimeout(() => setLoading(null), 2000);
    } catch (error) {
      console.error('Subscription error:', error);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full power of Job-Lander with blockchain-verified resumes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.tier !== 'free' && <Crown className="h-5 w-5 text-yellow-500" />}
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  {plan.price > 0 && <span className="text-gray-500 ml-1">/month</span>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id || (user?.tier === plan.tier)}
                >
                  {loading === plan.id ? (
                    'Processing...'
                  ) : user?.tier === plan.tier ? (
                    'Current Plan'
                  ) : plan.price === 0 ? (
                    'Get Started'
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-yellow-500 mr-2" />
            <h3 className="text-xl font-semibold">Blockchain Verification</h3>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            All paid plans include blockchain verification for tamper-proof resume authenticity.
            Stand out with cryptographically verified credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
