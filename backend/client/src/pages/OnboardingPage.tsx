import { useAppStore } from "@/context/appStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronRight } from "lucide-react";

export const OnboardingPage = () => {
  const onboarding = useAppStore((state) => state.onboarding);
  const completeStep = useAppStore((state) => state.completeOnboardingStep);

  const completedCount = onboarding.filter((step) => step.completed).length;
  const percentage = Math.round((completedCount / onboarding.length) * 100);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="accent">Guided Onboarding</Badge>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Launch JobLander with a{" "}
          <span className="text-accent">personalized activation plan</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Curated tasks help you configure AI, import your resume, and unlock
          intelligent insights within the first session.
        </p>
      </header>

      <Card className="border border-border/50 bg-surface/80">
        <CardHeader className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Onboarding progress
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {completedCount}/{onboarding.length} complete
              </h2>
              <p className="text-sm text-muted-foreground">
                Unlock advanced AI once onboarding is finished.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{percentage}%</span>
              <Progress value={percentage} className="w-40" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {onboarding.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col gap-4 rounded-2xl border p-5 md:flex-row md:items-center md:justify-between ${
                step.completed
                  ? "border-primary/35 bg-primary/10"
                  : "border-border/40 bg-surface/70"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm font-semibold">
                  {step.completed ? <CheckCircle2 className="h-4 w-4 text-primary" /> : index + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
              <Button
                variant={step.completed ? "outline" : "accent"}
                className="gap-2 self-start md:self-center"
                onClick={() => !step.completed && completeStep(step.id)}
                disabled={step.completed}
              >
                {step.completed ? "Done" : step.actionLabel}
                {!step.completed && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
