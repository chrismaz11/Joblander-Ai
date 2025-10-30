import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { DollarSign, TrendingUp, Target, Info, Lightbulb } from 'lucide-react';

export function SalaryNegotiator() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    yearsExperience: '',
    currentSalary: '',
    offeredSalary: '',
  });

  const calculateRecommendation = () => {
    // Mock calculation - would use real market data in production
    const offered = parseInt(formData.offeredSalary) || 0;
    const target = offered * 1.15; // 15% higher
    return {
      minimum: Math.round(offered * 1.05),
      target: Math.round(target),
      maximum: Math.round(offered * 1.25),
    };
  };

  const recommendation = calculateRecommendation();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Salary Negotiation Assistant</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get data-driven insights to negotiate your best compensation package
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-gray-900 dark:text-white mb-6">Job Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input
                placeholder="e.g., Senior Software Engineer"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="e.g., San Francisco, CA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Years of Experience</Label>
              <Input
                type="number"
                placeholder="e.g., 5"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Current Salary</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="120000"
                  className="pl-10"
                  value={formData.currentSalary}
                  onChange={(e) => setFormData({ ...formData, currentSalary: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Offered Salary</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="150000"
                  className="pl-10"
                  value={formData.offeredSalary}
                  onChange={(e) => setFormData({ ...formData, offeredSalary: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
            <Target className="w-4 h-4 mr-2" />
            Calculate Negotiation Range
          </Button>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
            <h3 className="text-gray-900 dark:text-white mb-2">Market Data</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Based on 1,250 similar roles
            </p>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Average</span>
                <p className="text-gray-900 dark:text-white">$165,000</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Range</span>
                <p className="text-gray-900 dark:text-white">$140K - $210K</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Quick Tips</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-400">Always negotiate total compensation, not just salary</p>
              </div>
              <div className="flex gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-400">Research market rates before the negotiation</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {formData.offeredSalary && (
        <Card className="p-6 mt-6">
          <h3 className="text-gray-900 dark:text-white mb-6">Recommended Negotiation Range</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-gray-600 dark:text-gray-400 mb-2">Minimum Ask</p>
              <h2 className="text-gray-900 dark:text-white mb-1">${recommendation.minimum.toLocaleString()}</h2>
              <p className="text-gray-500 dark:text-gray-500">+5% from offer</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border-2 border-green-500">
              <Badge className="bg-green-600 text-white mb-2">Recommended</Badge>
              <h2 className="text-gray-900 dark:text-white mb-1">${recommendation.target.toLocaleString()}</h2>
              <p className="text-gray-500 dark:text-gray-500">+15% from offer</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-gray-600 dark:text-gray-400 mb-2">Stretch Goal</p>
              <h2 className="text-gray-900 dark:text-white mb-1">${recommendation.maximum.toLocaleString()}</h2>
              <p className="text-gray-500 dark:text-gray-500">+25% from offer</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
