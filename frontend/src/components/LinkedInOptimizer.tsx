import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Sparkles, Linkedin } from 'lucide-react';

export function LinkedInOptimizer() {
  const profileScore = 75;
  
  const recommendations = [
    { type: 'critical', title: 'Add a professional headline', description: 'Your headline is the first thing recruiters see', completed: false },
    { type: 'important', title: 'Complete your skills section', description: 'Add at least 5 relevant skills', completed: false },
    { type: 'recommended', title: 'Get 3 more recommendations', description: 'Recommendations boost credibility', completed: false },
    { type: 'completed', title: 'Profile photo uploaded', description: 'Profiles with photos get 14x more views', completed: true },
    { type: 'completed', title: 'Work experience added', description: 'Complete work history is essential', completed: true },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">LinkedIn Optimizer</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Improve your LinkedIn profile to attract recruiters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 dark:text-white">Profile Score</h3>
            <Badge className={profileScore >= 80 ? 'bg-green-600' : 'bg-yellow-600'}>
              {profileScore >= 80 ? 'Excellent' : 'Good'}
            </Badge>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 dark:text-gray-300">Profile Completion</span>
              <span className="text-gray-900 dark:text-white">{profileScore}%</span>
            </div>
            <Progress value={profileScore} className="h-3" />
          </div>

          <h3 className="text-gray-900 dark:text-white mb-4">Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className={`p-4 rounded-lg border ${
                rec.completed 
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                  : rec.type === 'critical'
                  ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-start gap-3">
                  {rec.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      rec.type === 'critical' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                    }`} />
                  )}
                  <div className="flex-1">
                    <h4 className="text-gray-900 dark:text-white mb-1">{rec.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{rec.description}</p>
                  </div>
                  {!rec.completed && (
                    <Button size="sm" variant="outline">Fix</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <Linkedin className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="text-gray-900 dark:text-white mb-2">Connect Your LinkedIn</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Import your profile for personalized suggestions
            </p>
            <Button className="w-full" variant="outline">
              Connect LinkedIn
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Profile Views (Last 30 days)</p>
                <p className="text-gray-900 dark:text-white">245</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Search Appearances</p>
                <p className="text-gray-900 dark:text-white">89</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Connections</p>
                <p className="text-gray-900 dark:text-white">523</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
