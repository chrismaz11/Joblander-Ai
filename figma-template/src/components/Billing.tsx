import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Check, Sparkles, CreditCard, Download, AlertCircle, Zap } from 'lucide-react';

export function Billing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const currentPlan = {
    name: 'Professional',
    price: billingCycle === 'monthly' ? 19 : 190,
    period: billingCycle === 'monthly' ? 'month' : 'year',
    renewalDate: 'November 25, 2025',
    status: 'active',
  };

  const usage = {
    resumes: { used: 23, limit: -1, label: 'AI Resumes Generated' },
    applications: { used: 45, limit: -1, label: 'Active Applications' },
    storage: { used: 2.4, limit: 10, label: 'Storage Used (GB)' },
  };

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        '5 AI resume generations/month',
        'Up to 10 active applications',
        'Basic analytics',
        'Email support',
        '1 GB storage',
      ],
      current: false,
    },
    {
      name: 'Professional',
      price: { monthly: 19, yearly: 190 },
      description: 'For serious job seekers',
      features: [
        'Unlimited AI resume generations',
        'Unlimited applications',
        'Advanced analytics & insights',
        'Interview prep tools',
        'Priority email support',
        'Custom resume templates',
        '10 GB storage',
        'Export reports',
      ],
      current: true,
      popular: true,
    },
    {
      name: 'Enterprise',
      price: { monthly: 49, yearly: 490 },
      description: 'For career professionals',
      features: [
        'Everything in Professional',
        'Career coaching sessions',
        'LinkedIn optimization',
        'Salary negotiation tools',
        '24/7 priority support',
        'Custom integrations',
        'Unlimited storage',
        'White-label reports',
        'API access',
      ],
      current: false,
    },
  ];

  const invoices = [
    { id: 'INV-2025-11', date: 'Nov 1, 2025', amount: 19.00, status: 'paid', plan: 'Professional' },
    { id: 'INV-2025-10', date: 'Oct 1, 2025', amount: 19.00, status: 'paid', plan: 'Professional' },
    { id: 'INV-2025-09', date: 'Sep 1, 2025', amount: 19.00, status: 'paid', plan: 'Professional' },
    { id: 'INV-2025-08', date: 'Aug 1, 2025', amount: 19.00, status: 'paid', plan: 'Professional' },
  ];

  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiry: '12/26',
      isDefault: true,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Billing & Subscription</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your subscription, billing, and payment methods
        </p>
      </div>

      {/* Current Plan Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 lg:col-span-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-blue-100 mb-1">Current Plan</p>
              <h2 className="text-white mb-2">{currentPlan.name}</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-white text-3xl">${currentPlan.price}</span>
                <span className="text-blue-100">/{currentPlan.period}</span>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-white/30">
              {currentPlan.status === 'active' ? '✓ Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-blue-100 mb-6">
            Your subscription renews on {currentPlan.renewalDate}
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              Upgrade Plan
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Manage Subscription
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-gray-900 dark:text-white mb-4">Usage This Month</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">AI Resumes</span>
                <span className="text-gray-900 dark:text-white">
                  {usage.resumes.used} {usage.resumes.limit > 0 ? `/ ${usage.resumes.limit}` : ''}
                </span>
              </div>
              {usage.resumes.limit > 0 && (
                <Progress value={(usage.resumes.used / usage.resumes.limit) * 100} className="h-2" />
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Storage</span>
                <span className="text-gray-900 dark:text-white">
                  {usage.storage.used} GB / {usage.storage.limit} GB
                </span>
              </div>
              <Progress value={(usage.storage.used / usage.storage.limit) * 100} className="h-2" />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        {/* Plans Tab */}
        <TabsContent value="plans">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg inline-flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Yearly
                <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  Save 17%
                </Badge>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`p-6 relative ${
                  plan.popular ? 'border-2 border-blue-500 shadow-lg' : ''
                } ${plan.current ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}
                {plan.current && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white">
                    Current Plan
                  </Badge>
                )}

                <div className="mb-6 mt-2">
                  <h3 className="text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-gray-900 dark:text-white text-3xl">
                      ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.current ? 'outline' : plan.popular ? 'default' : 'outline'}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : plan.name === 'Free' ? 'Downgrade' : 'Upgrade'}
                </Button>
              </Card>
            ))}
          </div>

          <Card className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-white mb-2">Need a custom plan?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We offer custom enterprise plans with dedicated support, custom integrations, and volume pricing for teams and organizations.
                </p>
                <Button variant="outline">Contact Sales</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900 dark:text-white">Payment Methods</h3>
                <Button>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gray-900 dark:bg-gray-100 rounded flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white dark:text-gray-900" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 dark:text-white">
                            {method.brand} •••• {method.last4}
                          </span>
                          {method.isDefault && (
                            <Badge variant="outline" className="text-green-600 dark:text-green-400">
                              Default
                            </Badge>
                          )}
                        </div>
                        <span className="text-gray-500 dark:text-gray-500">
                          Expires {method.expiry}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm">
                          Set as Default
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-gray-900 dark:text-white mb-1">Payment Security</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    All payment information is encrypted and securely processed by Stripe. We never store your full card details.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-6">Billing History</h3>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-gray-900 dark:text-white">{invoice.id}</span>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {invoice.plan} Plan • {invoice.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-900 dark:text-white">${invoice.amount.toFixed(2)}</span>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
