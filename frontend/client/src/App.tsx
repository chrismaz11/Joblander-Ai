import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";

// Lazy-loaded pages
const Home = lazy(() => import("@/pages/home"));
const CreateResume = lazy(() => import("@/pages/create-resume"));
const Templates = lazy(() => import("@/pages/templates"));
const Jobs = lazy(() => import("@/pages/jobs"));
const Verify = lazy(() => import("@/pages/verify"));
const CoverLetter = lazy(() => import("@/pages/cover-letter"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ResumeBuilder = lazy(() => import("@/pages/ResumeBuilder"));
const Pricing = lazy(() => import("@/pages/pricing"));
const Login = lazy(() => import("@/pages/login"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create" component={CreateResume} />
      <Route path="/templates" component={Templates} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/verify" component={Verify} />
      <Route path="/cover-letter" component={CoverLetter} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/resume-builder" component={ResumeBuilder} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="job-lander-theme">
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          <Suspense
            fallback={
              <div className="py-20 text-center text-muted-foreground">
                Loading...
              </div>
            }
          >
            <Router />
          </Suspense>
        </main>
      </div>
    </ThemeProvider>
  );
}
