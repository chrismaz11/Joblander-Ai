import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  FileText,
  Mail,
  Briefcase,
  Template,
  User,
  Settings,
  LogOut,
  Crown,
  Brain,
  Search,
  BarChart3,
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    isActive: (path: string) => path === "/dashboard",
  },
  {
    title: "Resume Builder",
    url: "/resume-builder",
    icon: FileText,
    isActive: (path: string) => path === "/resume-builder" || path === "/create",
  },
  {
    title: "Cover Letters",
    url: "/cover-letter",
    icon: Mail,
    isActive: (path: string) => path === "/cover-letter",
  },
  {
    title: "AI Letter Generator",
    url: "/letter-generator",
    icon: Mail,
    isActive: (path: string) => path === "/letter-generator",
  },
  {
    title: "Job Search",
    url: "/jobs",
    icon: Search,
    isActive: (path: string) => path === "/jobs",
  },
  {
    title: "Templates",
    url: "/templates",
    icon: Template,
    isActive: (path: string) => path === "/templates",
  },
  {
    title: "Portfolio",
    url: "/portfolio",
    icon: Briefcase,
    isActive: (path: string) => path === "/portfolio",
  },
  {
    title: "AI Features",
    url: "/ai-features",
    icon: Brain,
    isActive: (path: string) => path === "/ai-features",
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    isActive: (path: string) => path === "/analytics",
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <img 
            src="/logo.png" 
            alt="JobLander" 
            className="h-8 w-8 rounded-md object-cover flex-shrink-0" 
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }} 
          />
          {state === "expanded" && (
            <span className="text-lg font-bold truncate">JobLander</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive(location)}
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAuthenticated && (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={state === "collapsed" ? "Pricing" : undefined}
                  >
                    <Link href="/pricing">
                      <Crown className="h-4 w-4" />
                      <span>Upgrade</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={state === "collapsed" ? "Verify" : undefined}
                  >
                    <Link href="/verify">
                      <Settings className="h-4 w-4" />
                      <span>Verify</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t">
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage 
                    src={user.profileImageUrl || undefined} 
                    alt={user.email || "User"} 
                  />
                  <AvatarFallback className="rounded-lg">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.firstName || user.lastName
                      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                      : "User"}
                  </span>
                  <span className="truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage 
                      src={user.profileImageUrl || undefined} 
                      alt={user.email || "User"} 
                    />
                    <AvatarFallback className="rounded-lg">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.firstName || user.lastName
                        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                        : "User"}
                    </span>
                    <span className="truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/api/logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SidebarMenuButton asChild size="lg">
            <Link href="/login">
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}