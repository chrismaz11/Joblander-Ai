import { useState } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { JobSearch } from './components/JobSearch';
import { JobBoard } from './components/JobBoard';
import { Applications } from './components/Applications';
import { JobDetails } from './components/JobDetails';
import { Analytics } from './components/Analytics';
import { ResumeBuilder } from './components/ResumeBuilder';
import { ResumeParser } from './components/ResumeParser';
import { InterviewManager } from './components/InterviewManager';
import { InterviewPrep } from './components/InterviewPrep';
import { SalaryNegotiator } from './components/SalaryNegotiator';
import { NetworkingHub } from './components/NetworkingHub';
import { LinkedInOptimizer } from './components/LinkedInOptimizer';
import { Templates } from './components/Templates';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { Billing } from './components/Billing';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Onboarding } from './components/Onboarding';
import { 
  LayoutDashboard, 
  Search,
  Briefcase, 
  FileText, 
  BarChart3, 
  Calendar,
  DollarSign,
  Users,
  Linkedin,
  Library,
  User,
  Settings as SettingsIcon, 
  CreditCard,
  LogOut,
  Sparkles,
  ChevronDown,
  Bell,
  Search as SearchIcon,
  GraduationCap
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';

export type PageType = 
  | 'landing' 
  | 'login' 
  | 'signup' 
  | 'onboarding' 
  | 'resume-parser'
  | 'dashboard' 
  | 'job-search'
  | 'jobs' 
  | 'applications' 
  | 'job-details' 
  | 'analytics' 
  | 'resume' 
  | 'interviews' 
  | 'interview-prep'
  | 'salary'
  | 'networking'
  | 'linkedin'
  | 'templates'
  | 'profile'
  | 'settings' 
  | 'billing';

function AppContent() {
  const { user, loading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setCurrentPage('resume-parser');
  };

  const handleResumeUpload = (data: any) => {
    setHasUploadedResume(true);
    setCurrentPage('dashboard');
  };

  const handleSkipResume = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    setHasCompletedOnboarding(false);
    setHasUploadedResume(false);
    setCurrentPage('landing');
  };

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Landing, Login, Signup - No sidebar
  if (!user) {
    if (currentPage === 'signup') {
      return <SignupPage onNavigateToLogin={() => setCurrentPage('login')} />;
    }
    if (currentPage === 'login') {
      return <LoginPage onNavigateToSignup={() => setCurrentPage('signup')} />;
    }
    return <LandingPage onNavigateToLogin={() => setCurrentPage('login')} onNavigateToSignup={() => setCurrentPage('signup')} />;
  }

  // Onboarding Flow
  if (user && !hasCompletedOnboarding && currentPage === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Resume Parser (post-onboarding)
  if (user && hasCompletedOnboarding && !hasUploadedResume && currentPage === 'resume-parser') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <ResumeParser onParsed={handleResumeUpload} onSkip={handleSkipResume} />
      </div>
    );
  }

  // Auto-redirect to onboarding for new users
  if (user && !hasCompletedOnboarding && currentPage === 'landing') {
    setCurrentPage('onboarding');
  }

  // Auto-redirect to dashboard for authenticated users
  if (user && hasCompletedOnboarding && currentPage === 'landing') {
    setCurrentPage('dashboard');
  }

  const navigationItems = [
    { id: 'dashboard' as PageType, label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'job-search' as PageType, label: 'Job Search', icon: <Search className="w-5 h-5" />, badge: 'New' },
    { id: 'jobs' as PageType, label: 'Job Board', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'applications' as PageType, label: 'Applications', icon: <FileText className="w-5 h-5" /> },
    { id: 'interviews' as PageType, label: 'Interviews', icon: <Calendar className="w-5 h-5" /> },
    { id: 'interview-prep' as PageType, label: 'Interview Prep', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'resume' as PageType, label: 'Resume Builder', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'templates' as PageType, label: 'Templates', icon: <Library className="w-5 h-5" /> },
    { id: 'salary' as PageType, label: 'Salary Tool', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'networking' as PageType, label: 'Networking', icon: <Users className="w-5 h-5" /> },
    { id: 'linkedin' as PageType, label: 'LinkedIn', icon: <Linkedin className="w-5 h-5" /> },
    { id: 'analytics' as PageType, label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'job-search':
        return <JobSearch />;
      case 'jobs':
        return <JobBoard />;
      case 'applications':
        return <Applications />;
      case 'job-details':
        return <JobDetails onBack={() => setCurrentPage('applications')} />;
      case 'analytics':
        return <Analytics />;
      case 'resume':
        return <ResumeBuilder />;
      case 'resume-parser':
        return <ResumeParser onParsed={handleResumeUpload} onSkip={handleSkipResume} />;
      case 'interviews':
        return <InterviewManager />;
      case 'interview-prep':
        return <InterviewPrep />;
      case 'salary':
        return <SalaryNegotiator />;
      case 'networking':
        return <NetworkingHub />;
      case 'linkedin':
        return <LinkedInOptimizer />;
      case 'templates':
        return <Templates />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'billing':
        return <Billing />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-gray-900 dark:text-white">JobLander</h1>
                <p className="text-gray-600 dark:text-gray-400">Track your career</p>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Banner */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 text-white">
              <Badge className="bg-white/20 text-white border-0 mb-2">
                Free Plan
              </Badge>
              <p className="mb-3">5 AI resumes left</p>
              <Button size="sm" variant="secondary" className="w-full bg-white text-blue-600 hover:bg-gray-100" onClick={() => setCurrentPage('billing')}>
                Upgrade Plan
              </Button>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-blue-600 text-white text-xs">{item.badge}</Badge>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>
        
        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
          <button
            onClick={() => setCurrentPage('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentPage === 'profile'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <User className="w-5 h-5" />
            {!sidebarCollapsed && <span>Profile</span>}
          </button>
          
          <button
            onClick={() => setCurrentPage('billing')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentPage === 'billing'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            {!sidebarCollapsed && <span>Billing</span>}
          </button>
          
          <button
            onClick={() => setCurrentPage('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentPage === 'settings'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search applications, companies..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Menu */}
              <button 
                onClick={() => setCurrentPage('profile')}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">
                    {user?.user_metadata?.full_name ? 
                      user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 
                      user?.email?.charAt(0).toUpperCase() || 'U'
                    }
                  </span>
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-gray-900 dark:text-white text-sm">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Free Plan</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
