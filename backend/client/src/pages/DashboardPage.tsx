import {
  analyticsSnapshot,
  mockResumes,
  recentAiActivity,
} from "@/data/mockData";
import { useAppStore } from "@/context/appStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate, formatTimeAgo } from "@/utils/format";
import { ArrowUpRight, Sparkles, TrendingUp } from "lucide-react";

export const DashboardPage = () => {
  const user = useAppStore((state) => state.user);
  const usage = useAppStore((state) => state.usage);
  const onboarding = useAppStore((state) => state.onboarding);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-hero px-8 py-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/10" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-4">
            <Badge variant="accent" className="tracking-normal">
              Intelligent Career OS
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
              Welcome back, {user.name.split(" ")[0]} —{" "}
              <span className="text-accent">JobLander AI</span> is already
              planning your next big move.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground">
              Resume intelligence, job-market insights, interview prep, and
              salary negotiation playbooks — orchestrated in one proactive
              workspace.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>
                Last login: <strong>{formatTimeAgo(user.lastLogin ?? "")}</strong>
              </span>
              <span className="hidden md:inline">•</span>
              <span>
                Tier: <strong className="capitalize">{user.tier}</strong>
              </span>
              <span className="hidden md:inline">•</span>
              <span>
                AI credits: <strong>{user.aiCredits}</strong>
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-glow backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/20 p-3 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  AI actions this week
                </p>
                <h3 className="text-3xl font-semibold text-foreground">42</h3>
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-xs uppercase text-muted-foreground">
                <span>Resume projects</span>
                <span>
                  {usage.resumes}/
                  <span className="capitalize">{user.tier}</span>
                </span>
              </div>
              <Progress value={(usage.resumes / 10) * 100} />
            </div>
            <Button variant="accent" className="gap-2">
              Continue onboarding
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {analyticsSnapshot.map((stat) => (
          <Card key={stat.id} className="group">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-3xl font-semibold text-foreground">
                  {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
              <div className="rounded-full bg-primary/15 p-3 text-primary group-hover:scale-105 group-hover:bg-primary/25">
                <TrendingUp className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary">+{stat.trend}%</span> {stat.changeLabel}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Active resume projects</h2>
            <p className="text-sm text-muted-foreground">
              AI-driven enhancements, ATS scoring, and export readiness in one view.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {mockResumes.map((resume) => (
              <div
                key={resume.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-surface/60 p-5 transition hover:border-primary/40 hover:bg-surface/80"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {resume.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {resume.role} • {resume.location}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {resume.status}
                  </Badge>
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      ATS score
                    </span>
                    <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                      <Sparkles className="h-4 w-4" />
                      <span className="font-medium">{resume.atsScore}%</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Updated {formatTimeAgo(resume.updatedAt)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {resume.improvements.map((improvement) => (
                      <span
                        key={improvement}
                        className="rounded-full bg-muted/30 px-3 py-1"
                      >
                        {improvement}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-foreground">Next best actions</h2>
              <p className="text-sm text-muted-foreground">
                Tailored guidance from JobLander AI to keep momentum.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {onboarding.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start gap-3 rounded-2xl border border-border/50 bg-surface/70 p-4"
                >
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm font-semibold text-muted-foreground">
                    {step.completed ? (
                      <span className="text-primary">✓</span>
                    ) : (
                      onboarding.indexOf(step) + 1
                    )}
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {step.title}
                      </h3>
                      {step.completed ? (
                        <Badge variant="subtle">Completed</Badge>
                      ) : (
                        <Badge variant="accent">Action</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    <Button variant="ghost" size="sm" className="gap-2 text-primary">
                      {step.actionLabel}
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-foreground">Latest AI activity</h2>
              <p className="text-sm text-muted-foreground">
                Transparent log of automation across your workspace.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAiActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border/40 bg-surface/70 p-4"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {activity.title}
                    </h3>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {activity.type} • {formatTimeAgo(activity.createdAt)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <span
                          key={key}
                          className="rounded-full bg-muted/35 px-3 py-1 capitalize"
                        >
                          {key}: <strong>{value}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
