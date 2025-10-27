import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";

// Pages
import Home from "@/pages/home";
import CreateResume from "@/pages/create-resume";
import Templates from "@/pages/templates";
import Jobs from "@/pages/jobs";
import Verify from "@/pages/verify";
import CoverLetter from "@/pages/cover-letter";
import Dashboard from "@/pages/dashboard";
import Pricing from "@/pages/pricing";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

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
      <Route path="/pricing" component={Pricing} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="job-lander-theme">
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <main>
            <Router />
          </main>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
