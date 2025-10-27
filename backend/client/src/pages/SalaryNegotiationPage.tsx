import { salaryPlaybooks } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Lightbulb, Scale } from "lucide-react";

export const SalaryNegotiationPage = () => {
  const playbook = salaryPlaybooks[0];

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="accent">Negotiation Intelligence</Badge>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Structure compelling counteroffers with{" "}
          <span className="text-accent">data-backed leverage</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          JobLander triangulates market benchmarks, offer breakdowns, and your career
          narrative to craft negotiation strategies that land equitable packages.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Offer overview</h2>
            <p className="text-sm text-muted-foreground">
              AI analyzes offer components, risk factors, and closing dynamics.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/40 bg-surface/70 p-4 text-sm text-muted-foreground">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Role
              </p>
              <p className="mt-1 text-base text-foreground">{playbook.role}</p>
              <p>{playbook.companyType}</p>
              {playbook.currentOffer && (
                <div className="mt-3 rounded-xl bg-primary/10 p-3 text-primary">
                  Current offer: {playbook.currentOffer}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border/40 bg-primary/10 p-4 text-sm text-primary">
              <p className="text-xs uppercase tracking-wide text-primary/80">
                Market benchmark
              </p>
              <p className="mt-2 text-base font-semibold text-primary">
                {playbook.marketRange}
              </p>
              <p className="mt-2 text-xs text-primary/75">
                Derived from 2,400 comp datapoints across Series B-D AI SaaS orgs.
              </p>
            </div>

            <Button className="w-full gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Export negotiation deck
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-surface/80">
          <CardContent className="space-y-6 p-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Leverage points
              </p>
              <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                {playbook.leveragePoints.map((point) => (
                  <li
                    key={point}
                    className="rounded-2xl border border-border/40 bg-surface/70 p-4"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border/40 bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Negotiation moves
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {playbook.negotiationMoves.map((move) => (
                  <li key={move} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      <Scale className="h-4 w-4" />
                    </span>
                    {move}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border/40 bg-primary/10 p-4">
              <p className="text-xs uppercase tracking-wide text-primary/80">
                Counteroffer suggestion
              </p>
              <p className="mt-2 text-lg font-semibold text-primary">
                Request $245k base / 0.45% equity / 25% bonus
              </p>
              <p className="mt-1 text-xs text-primary/80">
                Align with director-level pay band while anchoring to market median.
              </p>
              <Button variant="outline" className="mt-4 gap-2 text-primary">
                <Lightbulb className="h-4 w-4" />
                Generate negotiation script
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
