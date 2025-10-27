import { useLocation, NavLink } from "react-router-dom";
import { useAppStore } from "@/context/appStore";
import { appRoutes } from "@/routes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InputHTMLAttributes } from "react";
import { Bell, Moon, PlusCircle, Search, Sun } from "lucide-react";
import { useBackendHealth } from "@/hooks/useBackendHealth";

const SearchInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface/70 px-4 py-2 text-sm text-muted-foreground">
    <Search className="h-4 w-4 text-muted-foreground" />
    <input
      {...props}
      className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
    />
  </div>
);

export const TopBar = () => {
  const location = useLocation();
  const user = useAppStore((state) => state.user);
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const { data } = useBackendHealth();
  const backendStatus = data?.status === "healthy" ? "Online" : "Offline";

  const currentRoute =
    appRoutes.find((route) => route.path === location.pathname) ?? appRoutes[0];

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-border/40 bg-background/70 px-6 py-4 backdrop-blur lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {currentRoute.label}
          </p>
          <h1 className="text-lg font-semibold text-foreground">
            {currentRoute.description}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`hidden items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-wide md:inline-flex ${
              backendStatus === "Online"
                ? "bg-primary/15 text-primary"
                : "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-200"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            API {backendStatus}
          </span>
          <Button
            variant="ghost"
            className="p-2 text-muted-foreground transition hover:text-primary"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="outline" className="gap-2 text-primary">
            <PlusCircle className="h-4 w-4" />
            New AI action
          </Button>
          <Button variant="ghost" className="relative p-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute right-1 top-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </Button>
          <NavLink to="/profile" className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border/50">
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-right text-xs text-muted-foreground sm:block">
              <p className="text-foreground">{user.name}</p>
              <p className="capitalize">{user.tier} tier</p>
            </div>
          </NavLink>
        </div>
      </div>
      <SearchInput placeholder="Search resumes, jobs, contacts…" />
    </header>
  );
};
