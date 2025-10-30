import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, Video, MessageSquare, Star } from 'lucide-react';

export function InterviewPrep() {
  const commonQuestions = [
    'Tell me about yourself',
    'Why do you want to work here?',
    'What are your greatest strengths?',
    'What are your weaknesses?',
    'Where do you see yourself in 5 years?',
    'Why should we hire you?',
  ];

  const technicalTopics = [
    { name: 'Data Structures & Algorithms', difficulty: 'Hard', progress: 60 },
    { name: 'System Design', difficulty: 'Hard', progress: 40 },
    { name: 'APIs & REST', difficulty: 'Medium', progress: 80 },
    { name: 'Databases', difficulty: 'Medium', progress: 70 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-gray-900 dark:text-white mb-2">Interview Preparation</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Prepare for your interviews with curated resources and practice
      </p>

      <Tabs defaultValue="behavioral">
        <TabsList className="mb-6">
          <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="company">Company Research</TabsTrigger>
        </TabsList>

        <TabsContent value="behavioral">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">Common Questions</h3>
              <div className="space-y-3">
                {commonQuestions.map((q, i) => (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-start gap-3">
                    <Checkbox />
                    <span className="text-gray-700 dark:text-gray-300">{q}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 dark:text-white mb-4">STAR Method Template</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-900 dark:text-white mb-2">Situation</h4>
                  <p className="text-gray-600 dark:text-gray-400">Describe the context</p>
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white mb-2">Task</h4>
                  <p className="text-gray-600 dark:text-gray-400">Explain the challenge</p>
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white mb-2">Action</h4>
                  <p className="text-gray-600 dark:text-gray-400">Detail what you did</p>
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white mb-2">Result</h4>
                  <p className="text-gray-600 dark:text-gray-400">Share the outcome</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical">
          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-6">Technical Interview Topics</h3>
            <div className="space-y-4">
              {technicalTopics.map((topic, i) => (
                <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-gray-900 dark:text-white">{topic.name}</h4>
                    <Badge variant={topic.difficulty === 'Hard' ? 'destructive' : 'outline'}>
                      {topic.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${topic.progress}%` }}
                      />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">{topic.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card className="p-6">
            <h3 className="text-gray-900 dark:text-white mb-4">Company Research Checklist</h3>
            <div className="space-y-2">
              {[
                'Company mission and values',
                'Recent news and press releases',
                'Products and services',
                'Company culture and reviews',
                'Competitors and market position',
                'Interview format and process',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2">
                  <Checkbox />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
