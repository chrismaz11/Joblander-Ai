import { subscriptionPlans } from "@/data/mockData";
import { useAppStore } from "@/context/appStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

export const UpgradePage = () => {
  const tier = useAppStore((state) => state.selectedTier);
  const setTier = useAppStore((state) => state.setTier);

  return (
    <div className="space-y-8">
      <header className="text-center space-y-3">
        <Badge variant="accent">Pricing</Badge>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Scale from discovery to enterprise deployment
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
          Select a tier aligned to your goals. Upgrade anytime, and unlock deeper AI
          capabilities, analytics, and managed onboarding.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {subscriptionPlans.map((plan) => {
          const isCurrent = plan.id === tier;
          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden border ${
                plan.id === "pro"
                  ? "border-primary/60 bg-surface/80 shadow-glow"
                  : "border-border/60 bg-surface/70"
              }`}
            >
              {plan.id === "pro" && (
                <span className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs uppercase tracking-wide text-primary">
                  <Sparkles className="h-4 w-4" />
                  Recommended
                </span>
              )}
              <CardHeader>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {plan.name}
                </p>
                <h2 className="text-4xl font-semibold text-foreground">{plan.price}</h2>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-1 h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={isCurrent ? "outline" : plan.id === "pro" ? "accent" : "secondary"}
                  onClick={() => setTier(plan.id)}
                >
                  {isCurrent ? "Current plan" : plan.cta}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="border border-border/50 bg-gradient-to-r from-primary/10 to-accent/10 p-6 text-sm text-muted-foreground">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Enterprise enablement & security
            </p>
            <p>
              SOC2-ready architecture, SSO/SAML, dedicated success team, and tailored
              AI governance frameworks.
            </p>
          </div>
          <Button variant="accent" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Book a strategy session
          </Button>
        </div>
      </Card>
    </div>
  );
};
