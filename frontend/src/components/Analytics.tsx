import { Card } from '@/components/ui/card.tsx';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Analytics() {
  const applicationsTrend = [
    { month: 'Jun', applications: 12, interviews: 3, offers: 0 },
    { month: 'Jul', applications: 18, interviews: 5, offers: 1 },
    { month: 'Aug', applications: 25, interviews: 8, offers: 1 },
    { month: 'Sep', applications: 32, interviews: 12, offers: 2 },
    { month: 'Oct', applications: 24, interviews: 8, offers: 2 },
  ];

  const statusDistribution = [
    { name: 'Applied', value: 12, color: '#fbbf24' },
    { name: 'Phone Screen', value: 6, color: '#60a5fa' },
    { name: 'Interview', value: 8, color: '#818cf8' },
    { name: 'Offer', value: 2, color: '#34d399' },
    { name: 'Rejected', value: 6, color: '#f87171' },
  ];

  const responseRates = [
    { company: 'Google', rate: 85 },
    { company: 'Meta', rate: 72 },
    { company: 'Apple', rate: 68 },
    { company: 'Amazon', rate: 55 },
    { company: 'Microsoft', rate: 48 },
    { company: 'Netflix', rate: 42 },
  ];

  const timeToHire = [
    { stage: 'Applied to Response', days: 7 },
    { stage: 'Response to Phone', days: 5 },
    { stage: 'Phone to Interview', days: 10 },
    { stage: 'Interview to Offer', days: 14 },
  ];

  const insights = [
    {
      title: 'Best Application Day',
      value: 'Tuesday',
      description: '45% higher response rate',
      trend: 'up',
    },
    {
      title: 'Avg. Time to Offer',
      value: '36 days',
      description: '12% faster than average',
      trend: 'up',
    },
    {
      title: 'Interview Success Rate',
      value: '67%',
      description: 'Above industry average',
      trend: 'up',
    },
    {
      title: 'Active Applications',
      value: '18',
      description: 'Optimal range for tracking',
      trend: 'neutral',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your job search performance and insights</p>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {insights.map((insight, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between mb-2">
              <p className="text-gray-600 dark:text-gray-400">{insight.title}</p>
              {insight.trend === 'up' && (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              )}
            </div>
            <h2 className="text-gray-900 dark:text-white mb-1">{insight.value}</h2>
            <p className="text-gray-500 dark:text-gray-500">{insight.description}</p>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Applications Trend */}
        <Card className="p-6">
          <h3 className="text-gray-900 dark:text-white mb-6">Applications Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicationsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={2} />
              <Line type="monotone" dataKey="interviews" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="offers" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-gray-900 dark:text-white mb-6">Application Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Response Rates */}
        <Card className="p-6">
          <h3 className="text-gray-900 dark:text-white mb-6">Response Rate by Company</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={responseRates} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="company" type="category" stroke="#9ca3af" width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="rate" fill="#6366f1" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Time to Hire */}
        <Card className="p-6">
          <h3 className="text-gray-900 dark:text-white mb-6">Average Time by Stage (Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeToHire}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="stage" stroke="#9ca3af" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="days" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-gray-900 dark:text-white mb-4">Top Skills in Demand</h3>
          <div className="space-y-3">
            {[
              { skill: 'React', percentage: 85 },
              { skill: 'TypeScript', percentage: 72 },
              { skill: 'Node.js', percentage: 68 },
              { skill: 'Python', percentage: 55 },
              { skill: 'AWS', percentage: 48 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{item.skill}</span>
                  <span className="text-gray-600 dark:text-gray-400">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-gray-900 dark:text-white mb-4">Application Sources</h3>
          <div className="space-y-3">
            {[
              { source: 'LinkedIn', count: 12, color: 'bg-blue-500' },
              { source: 'Company Website', count: 8, color: 'bg-green-500' },
              { source: 'Indeed', count: 6, color: 'bg-purple-500' },
              { source: 'Referral', count: 4, color: 'bg-yellow-500' },
              { source: 'Other', count: 2, color: 'bg-gray-500' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-gray-700 dark:text-gray-300">{item.source}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">{item.count} apps</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-gray-900 dark:text-white mb-4">Goals Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">Weekly Applications</span>
                <span className="text-gray-600 dark:text-gray-400">8/10</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">Monthly Interviews</span>
                <span className="text-gray-600 dark:text-gray-400">6/8</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">Network Connections</span>
                <span className="text-gray-600 dark:text-gray-400">25/30</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
