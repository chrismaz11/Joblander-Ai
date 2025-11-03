import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

const plans = [
  {
    id: 'pro',
    name: 'Professional',
    price: 19.95,
    description: 'Perfect for active job seekers',
    features: [
      'Unlimited AI resume generations',
      'Unlimited cover letters',
      'Premium templates',
      'AI job matching',
      'Interview prep tools'
    ],
    popular: true,
    icon: Crown
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9.95,
    description: 'Essential tools for job hunting',
    features: [
      '10 AI resume generations/month',
      '10 cover letters/month',
      'Premium templates',
      'Basic job matching'
    ],
    popular: false,
    icon: Zap
  },
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Try JobLander risk-free',
    features: [
      '1 AI resume generation/month',
      '3 cover letters/month',
      'Basic templates',
      'Manual job search'
    ],
    popular: false,
    icon: Star
  }
];

export default function Signup() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'plan' | 'details'>('plan');
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setStep('details');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiRequest("POST", "/api/signup", { 
        email, 
        firstName, 
        lastName, 
        selectedPlan 
      });
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      if (selectedPlan !== 'free') {
        setLocation(`/checkout?plan=${selectedPlan}`);
      } else {
        setLocation("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 'plan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your JobLander Plan
            </h1>
            <p className="text-xl text-gray-600">
              Start with AI-powered resume generation and land your dream job faster
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card 
                  key={plan.id} 
                  className={`relative cursor-pointer transition-all hover:shadow-lg ${
                    plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                  }`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        plan.popular ? 'bg-blue-500' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      {plan.price > 0 && <span className="text-gray-500 ml-1">/month</span>}
                    </div>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.price === 0 ? 'Start Free' : `Choose ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              All plans include 7-day free trial • Cancel anytime • No setup fees
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-semibold">
            Complete Your Signup
          </CardTitle>
          <CardDescription>
            You selected: <Badge variant="secondary">{selectedPlanData?.name}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating Account..." : 
               selectedPlan === 'free' ? "Start Free Account" : "Continue to Payment"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setStep('plan')}
            >
              ← Back to Plans
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}