import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, CheckCircle2, Circle } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

export function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);

  const { data: todosData } = useQuery<Todo[]>({
    queryKey: ['/api/todos'],
    enabled: isAuthenticated,
  });

  const { data: statsData } = useQuery<Stat[]>({
    queryKey: ['/api/job-stats'],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (todosData) {
      setTodos(todosData);
    }
  }, [todosData]);

  const stats = statsData || [];

  interface AiSuggestion {
    icon: string;
    title: string;
    description: string;
    action: string;
  }

  interface Application {
    company: string;
    position: string;
    status: string;
    date: string;
    logo: string;
  }

  interface Interview {
    company: string;
    position: string;
    type: string;
    date: string;
    urgent: boolean;
  }

  const { data: aiSuggestionsData } = useQuery<AiSuggestion[]>({
    queryKey: ['/api/ai-suggestions'],
    enabled: isAuthenticated,
  });

  const { data: recentApplicationsData } = useQuery<Application[]>({
    queryKey: ['/api/applications/recent'],
    enabled: isAuthenticated,
  });

  const { data: upcomingInterviewsData } = useQuery<Interview[]>({
    queryKey: ['/api/interviews/upcoming'],
    enabled: isAuthenticated,
  });

  const aiSuggestions = aiSuggestionsData || [];
  const recentApplications = recentApplicationsData || [];
  const upcomingInterviews = upcomingInterviewsData || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Offer':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Interview':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Applied':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 dark:text-white mb-2">Welcome back, {user?.name || user?.email || 'there'}! 👋</h1>
            <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your job search today.</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI Resume
          </Button>
        </div>
      </div>

      {/* Stats Grid - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat: Stat, index: number) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              {stat.trend === 'up' && (
                <TrendingUp className="w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-gray-900 dark:text-white">{stat.value}</h2>
              <span className="text-green-600 dark:text-green-400">{stat.change}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* AI Suggestions */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-gray-900 dark:text-white">AI Suggestions</h3>
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
              New
            </Badge>
          </div>
          <div className="space-y-3">
            {aiSuggestions.map((suggestion: AiSuggestion, index: number) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{suggestion.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-gray-900 dark:text-white mb-1">{suggestion.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{suggestion.description}</p>
                    <Button size="sm" variant="outline">
                      {suggestion.action}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Today's To-Do */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 dark:text-white">Today's To-Do</h3>
            <Badge variant="outline">
              {todos.filter(t => !t.completed).length} left
            </Badge>
          </div>
          <div className="space-y-3 mb-4">
            {todos.slice(0, 5).map((todo) => (
              <div
                key={todo.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  todo.completed ? 'bg-gray-50 dark:bg-gray-900' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <span className={`text-gray-700 dark:text-gray-300 ${todo.completed ? 'line-through opacity-60' : ''}`}>
                    {todo.text}
                  </span>
                  {todo.priority === 'high' && !todo.completed && (
                    <Badge className="ml-2 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                      High
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full">
            + Add Task
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Upcoming Interviews */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 dark:text-white">Upcoming Interviews</h3>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div className="space-y-3">
            {upcomingInterviews.map((interview: Interview, index: number) => (
              <div key={index} className={`p-4 rounded-lg border ${interview.urgent ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-gray-900 dark:text-white">{interview.company}</p>
                    <p className="text-gray-600 dark:text-gray-400">{interview.position}</p>
                  </div>
                  <Badge variant="outline">{interview.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{interview.date}</span>
                  {interview.urgent && (
                    <Badge className="bg-red-600 text-white">Urgent</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">
            + Schedule Interview
          </Button>
        </Card>

        {/* Application Pipeline */}
        <Card className="p-6">
          <h3 className="text-gray-900 dark:text-white mb-4">Application Pipeline</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">Wishlist</span>
                <span className="text-gray-600 dark:text-gray-400">6 jobs</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">Applied</span>
                <span className="text-gray-600 dark:text-gray-400">12 jobs</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">Interview</span>
                <span className="text-gray-600 dark:text-gray-400">8 jobs</span>
              </div>
              <Progress value={33} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">Offer</span>
                <span className="text-gray-600 dark:text-gray-400">2 jobs</span>
              </div>
              <Progress value={8} className="h-2" />
            </div>
          </div>
          <Button className="w-full mt-4" variant="outline">
            View Job Board
          </Button>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 dark:text-white">Recent Applications</h3>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentApplications.map((app: Application, index: number) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl">
                  {app.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white truncate">{app.company}</p>
                  <p className="text-gray-500 dark:text-gray-500">{app.date}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2 truncate">{app.position}</p>
              <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
