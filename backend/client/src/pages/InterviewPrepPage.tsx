import { interviewPrepSets } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/utils/format";
import { ClipboardCheck, Mic, Sparkles, Target } from "lucide-react";

export const InterviewPrepPage = () => {
  const set = interviewPrepSets[0];

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="accent">Interview Intelligence</Badge>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Walk into every interview with{" "}
          <span className="text-accent">AI-backed readiness</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Role-specific playbooks, probable questions, and story prompts engineered
          for executive, technical, and behavioral rounds.
        </p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[360px,1fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Active prep sprint</h2>
            <p className="text-sm text-muted-foreground">
              JobLander organizes interview arcs into high-impact modules with daily
              practice prompts.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-2xl border border-border/40 bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Role
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{set.role}</h3>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {set.companyFocus}
              </p>
              <Badge variant="outline" className="mt-4 capitalize">
                {set.stage} stage
              </Badge>
            </div>

            <div className="rounded-2xl border border-border/40 bg-primary/10 p-4 text-primary">
              <p className="text-sm font-semibold">Focus areas</p>
              <ul className="mt-3 space-y-2 text-sm text-primary/85">
                {set.focusAreas.map((area) => (
                  <li key={area}>• {area}</li>
                ))}
              </ul>
            </div>

            <Button className="w-full gap-2">
              <Target className="h-4 w-4" />
              Personalize for next round
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-surface/80">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">
                Question intelligence
              </p>
              <Badge variant="accent" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI predicted
              </Badge>
            </div>
            <div className="space-y-5 text-sm text-muted-foreground">
              {set.questions.map((question) => (
                <div
                  key={question}
                  className="rounded-2xl border border-border/40 bg-surface/70 p-4"
                >
                  <p className="text-foreground">“{question}”</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                    Recommended storyline: tie to ARR impact & AI adoption metrics.
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="gap-2">
                <Mic className="h-4 w-4" />
                Launch mock interview
              </Button>
              <Button variant="outline" className="gap-2 text-primary">
                <ClipboardCheck className="h-4 w-4" />
                Export prep sheet
              </Button>
            </div>

            <div className="rounded-2xl border border-border/40 bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Recommended actions
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {set.recommendedActions.map((action) => (
                  <li key={action}>• {action}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
