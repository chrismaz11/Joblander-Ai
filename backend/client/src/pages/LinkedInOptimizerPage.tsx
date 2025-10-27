import { linkedinProfiles } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatTimeAgo } from "@/utils/format";
import { ClipboardCopy, Sparkles, Target, TrendingUp } from "lucide-react";

export const LinkedInOptimizerPage = () => {
  const profile = linkedinProfiles[0];

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="accent">LinkedIn Intelligence</Badge>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Become the{" "}
          <span className="text-accent">top search result</span> for recruiters and
          hiring leaders.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          JobLander breaks down algorithms, headline formulas, and keyword density to
          calibrate your LinkedIn profile for visibility, credibility, and inbound
          opportunities.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">
              Optimization control center
            </h2>
            <p className="text-sm text-muted-foreground">
              AI scorecards keep your headline, summary, and skills tuned to your
              target roles.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-2xl border border-border/40 bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Headline score
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-3xl font-semibold text-foreground">
                  {profile.headlineScore}%
                </span>
                <Button size="sm" variant="outline" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Regenerate
                </Button>
              </div>
              <Progress value={profile.headlineScore} className="mt-3" />
              <p className="mt-2 text-xs text-muted-foreground">
                Optimized for search: {profile.targetRole} • {profile.targetIndustry}
              </p>
            </div>

            <div className="rounded-2xl border border-border/40 bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                About section score
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-3xl font-semibold text-foreground">
                  {profile.aboutScore}%
                </span>
                <Button size="sm" variant="outline" className="gap-2">
                  <Target className="h-4 w-4" />
                  Refine messaging
                </Button>
              </div>
              <Progress value={profile.aboutScore} className="mt-3" />
              <p className="mt-2 text-xs text-muted-foreground">
                AI suggests weaving in impact statements for global launches.
              </p>
            </div>

            <div className="rounded-2xl border border-border/40 bg-primary/10 p-4 text-primary">
              <p className="text-sm font-semibold">Next actions</p>
              <ul className="mt-3 space-y-2 text-sm text-primary/90">
                <li>• Add metrics for AI product adoption (30%+ uplift).</li>
                <li>• Layer keywords: Responsible AI, Enterprise GTM, PLG.</li>
                <li>• Highlight cross-functional headcount leadership.</li>
              </ul>
              <Button className="mt-4 w-full gap-2">
                <TrendingUp className="h-4 w-4" />
                Apply AI recommendations
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-surface/80">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{profile.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Targeting {profile.targetRole} in {profile.targetIndustry}
                </p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Last optimized {formatTimeAgo(profile.lastOptimized)}
                </p>
              </div>
              <Badge variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI optimized
              </Badge>
            </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border/40 bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Optimized headline
              </p>
              <p className="mt-3 text-sm text-foreground">
                Executive Product Leader driving responsible AI innovation across
                enterprise SaaS (ARR $400MM+).
              </p>
              <Button variant="outline" className="mt-3 gap-2">
                <ClipboardCopy className="h-4 w-4" />
                Copy headline
              </Button>
            </div>
            <div className="rounded-2xl border border-border/40 bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                SEO keywords
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {profile.seoKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-muted/35 px-3 py-1 uppercase tracking-wide"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Used in headline, about, featured projects, recommendations.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/40 bg-surface/70 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              AI-crafted summary
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Director-level product strategist delivering enterprise AI adoption and
              responsible innovation. Led commercialization across three product lines
              with $120M ARR uplift, built global product orgs of 40+, and partnered
              with enterprise clients on AI governance. Passionate about translating
              research into resilient, human-centered systems.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Recommended skills
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {profile.skillsRecommended.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-muted/25 px-3 py-1 uppercase tracking-wide"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
  );
};
