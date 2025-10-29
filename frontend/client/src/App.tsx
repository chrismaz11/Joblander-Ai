import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HIGHLIGHTED_FEATURES = [
  "AI résumé generation",
  "Cover letter assistant",
  "ATS optimization",
  "Blockchain verification",
];

export default function App() {
  const features = useMemo(
    () =>
      HIGHLIGHTED_FEATURES.map((feature) => (
        <li
          key={feature}
          className="flex items-center gap-3 rounded-lg border border-border bg-card/60 px-4 py-3 text-sm text-muted-foreground shadow-sm backdrop-blur"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
            ✓
          </span>
          {feature}
        </li>
      )),
    [],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="h-8 w-8 rounded-lg bg-primary/10 text-center text-lg leading-8 text-primary">
              JL
            </span>
            Job Lander
          </div>
          <div className="hidden gap-2 md:flex">
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">Templates</Button>
            <Button variant="ghost">Support</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost">Log in</Button>
            <Button size="sm">Get started</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 md:flex-row md:items-center">
        <section className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Trusted by job seekers worldwide
          </span>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Launch your career with{" "}
            <span className="text-primary">AI-crafted résumés</span>.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground md:text-lg">
            Job Lander combines AI guidance, smart templates, and
            blockchain-backed verification to help you stand out and land offers
            faster.
          </p>

          <form className="flex flex-col gap-3 rounded-xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur md:flex-row md:items-center">
            <Input
              type="email"
              placeholder="Enter your best email"
              required
              className="md:max-w-xs"
            />
            <Button className="md:min-w-[160px]">Start building</Button>
            <p className="text-xs text-muted-foreground">
              No credit card required.
            </p>
          </form>

          <ul className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            {features}
          </ul>
        </section>

        <section className="flex min-w-[280px] flex-1 flex-col gap-4 rounded-2xl border border-border bg-card/70 p-6 shadow-lg backdrop-blur">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Latest résumé insights
            </div>
            <div className="rounded-lg border border-border bg-background/80 p-4 text-sm text-muted-foreground">
              “You’re ranking in the top 10% for project management positions in
              NYC. Highlight leadership achievements to jump higher.”
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Daily job matches
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-lg border border-border bg-background/80 p-3">
                <div className="font-medium text-foreground">
                  Senior Product Manager
                </div>
                <div>Atlas Labs · New York · Hybrid</div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                  Match rate 92%
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background/80 p-3">
                <div className="font-medium text-foreground">
                  Customer Success Lead
                </div>
                <div>Launchify · Remote · Full-time</div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-2 py-1 text-xs text-secondary-foreground">
                  Match rate 86%
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
