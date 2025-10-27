import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" data-testid="link-home">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Job-Lander</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Button
            asChild
            variant={isActive("/create") ? "secondary" : "ghost"}
            className="font-medium"
            data-testid="link-create"
          >
            <Link href="/create">Create Resume</Link>
          </Button>
          <Button
            asChild
            variant={isActive("/cover-letter") ? "secondary" : "ghost"}
            className="font-medium"
            data-testid="link-cover-letter"
          >
            <Link href="/cover-letter">Cover Letter</Link>
          </Button>
          <Button
            asChild
            variant={isActive("/templates") ? "secondary" : "ghost"}
            className="font-medium"
            data-testid="link-templates"
          >
            <Link href="/templates">Templates</Link>
          </Button>
          <Button
            asChild
            variant={isActive("/portfolio") ? "secondary" : "ghost"}
            className="font-medium"
            data-testid="link-portfolio"
          >
            <Link href="/portfolio">Portfolio</Link>
          </Button>
          {isAuthenticated && (
            <Button
              asChild
              variant={isActive("/dashboard") ? "secondary" : "ghost"}
              className="font-medium"
              data-testid="link-dashboard"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
          <Button
            asChild
            variant={isActive("/verify") ? "secondary" : "ghost"}
            className="font-medium"
            data-testid="link-verify"
          >
            <Link href="/verify">Verify</Link>
          </Button>
          <Button
            asChild
            variant={isActive("/jobs") ? "secondary" : "ghost"}
            className="font-medium"
            data-testid="link-jobs"
          >
            <Link href="/jobs">Find Jobs</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {!isLoading && !isAuthenticated && (
            <Button asChild className="hidden sm:inline-flex" data-testid="button-login">
              <a href="/api/login">Log In</a>
            </Button>
          )}

          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImageUrl || undefined} alt={user.email || "User"} style={{ objectFit: 'cover' }} />
                    <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user.firstName || user.lastName
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : user.email || "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" data-testid="menu-dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/api/logout" data-testid="menu-logout">Log Out</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
