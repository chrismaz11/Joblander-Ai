import { useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { useLocation } from "wouter";

const SIDEBAR_COOKIE_NAME = "sidebar_state";

function getBreadcrumbTitle(path: string): string {
  const routes: Record<string, string> = {
    "/": "Home",
    "/dashboard": "Dashboard",
    "/resume-builder": "Resume Builder",
    "/create": "Create Resume",
    "/cover-letter": "Cover Letters",
    "/letter-generator": "AI Letter Generator",
    "/jobs": "Job Search",
    "/templates": "Templates",
    "/portfolio": "Portfolio",
    "/pricing": "Pricing",
    "/login": "Sign In",
    "/verify": "Verify",
    "/analytics": "Analytics",
  };
  return routes[path] || "JobLander";
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  // Initialize sidebar state from cookie
  useEffect(() => {
    const savedState = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
      ?.split("=")[1];
    
    if (savedState === undefined) {
      // Set default state to expanded
      document.cookie = `${SIDEBAR_COOKIE_NAME}=true; path=/; max-age=${60 * 60 * 24 * 7}`;
    }
  }, []);

  const breadcrumbTitle = getBreadcrumbTitle(location);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sidebar-transition">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="breadcrumb-fade-in">{breadcrumbTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}