import { NavLink } from "react-router-dom";
import { appRoutes, type RouteCategory } from "@/routes";
import { useAppStore } from "@/context/appStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock, ExternalLink } from "lucide-react";

const categories: Record<RouteCategory, string> = {
  workspace: "Core Workspace",
  ai: "AI Studio",
  growth: "Growth & Networking",
  admin: "Operations",
};

const tierOrder = ["free", "pro", "enterprise"] as const;

export const Sidebar = () => {
  const tier = useAppStore((state) => state.selectedTier);

  return (
    <aside className="hidden h-screen w-72 flex-col border-r border-border/40 bg-surface/60 px-6 py-8 backdrop-blur-xl lg:flex">
      <div className="flex items-center justify-between">
        <NavLink
          to="/dashboard"
          className="text-lg font-semibold uppercase tracking-[0.3em] text-muted-foreground"
        >
          JobLander <span className="text-primary">AI</span>
        </NavLink>
        <Badge variant="outline" className="uppercase">
          {tier}
        </Badge>
      </div>

      <div className="mt-8 flex-1 space-y-8 overflow-y-auto pb-10">
        {Object.entries(categories).map(([category, label]) => {
          const items = appRoutes.filter((route) => route.category === category);
          if (items.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
                {label}
              </p>
              <div className="space-y-1">
                {items.map((route) => {
                  const Icon = route.icon;
                  const locked =
                    route.tier &&
                    tierOrder.indexOf(tier) < tierOrder.indexOf(route.tier);

                  return (
                    <NavLink
                      key={route.path}
                      to={locked ? "/upgrade" : route.path}
                      className={({ isActive }) =>
                        [
                          "group flex items-center justify-between gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm transition",
                          isActive
                            ? "border-primary/30 bg-primary/10 text-foreground shadow-glow"
                            : "text-muted-foreground hover:border-primary/20 hover:bg-surface/80 hover:text-foreground",
                        ].join(" ")
                      }
                    >
                      <span className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center rounded-xl bg-muted/30 p-2 text-muted-foreground group-hover:text-primary">
                          {locked ? <Lock className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </span>
                        <span>{route.label}</span>
                      </span>
                      {route.tier && (
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {route.tier}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4 text-sm text-primary">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wide">
          <Sparkles className="h-4 w-4" />
          Enterprise
        </span>
        <p className="mt-3 text-sm text-primary/90">
          Ready for managed onboarding, SSO, and AI governance reviews?
        </p>
        <Button variant="accent" className="mt-4 w-full gap-2" asChild>
          <NavLink to="/upgrade">
            Talk with us
            <ExternalLink className="h-4 w-4" />
          </NavLink>
        </Button>
      </div>
    </aside>
  );
};
