import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyticsSnapshot } from "@/data/mockData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

const performanceTrend = [
  { month: "Sep", subscribers: 1180, aiActions: 4800, exports: 820 },
  { month: "Oct", subscribers: 1320, aiActions: 5600, exports: 930 },
  { month: "Nov", subscribers: 1485, aiActions: 6120, exports: 990 },
  { month: "Dec", subscribers: 1620, aiActions: 7100, exports: 1120 },
  { month: "Jan", subscribers: 1752, aiActions: 8210, exports: 1210 },
  { month: "Feb", subscribers: 1845, aiActions: 9643, exports: 1286 },
];

export const AnalyticsPage = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="accent">Revenue & Usage Intelligence</Badge>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Operational clarity for{" "}
          <span className="text-accent">JobLander v4.0</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Monitor adoption, AI workloads, and monetization signals in one
          strategic dashboard designed for leadership reviews.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        <Card className="border border-border/50 bg-surface/80">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Subscription & AI usage trend
              </p>
              <h2 className="text-lg font-semibold text-foreground">
                6-month performance trajectory
              </h2>
            </div>
            <Button variant="outline" className="gap-2 text-primary">
              <TrendingUp className="h-4 w-4" />
              Export executive summary
            </Button>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend}>
                <defs>
                  <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(86,156,255,0.8)" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="rgba(86,156,255,0)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAiActions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(255,215,0,0.9)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="rgba(255,215,0,0)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.4)"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.4)"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(14,18,30,0.9)",
                    borderRadius: "16px",
                    border: "1px solid rgba(86,156,255,0.4)",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="subscribers"
                  stroke="rgba(86,156,255,0.9)"
                  fill="url(#colorSubscribers)"
                  strokeWidth={2}
                  name="Active subscribers"
                />
                <Area
                  type="monotone"
                  dataKey="aiActions"
                  stroke="rgba(255,215,0,0.85)"
                  fill="url(#colorAiActions)"
                  strokeWidth={2}
                  name="AI actions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {analyticsSnapshot.map((stat) => (
            <Card key={stat.id} className="border border-border/50 bg-surface/80">
              <CardContent className="flex flex-col gap-2 p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {typeof stat.value === "number"
                    ? stat.value.toLocaleString()
                    : stat.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  +{stat.trend}% {stat.changeLabel}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border/50 bg-surface/80">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">
              Funnel conversion insights
            </h2>
            <p className="text-sm text-muted-foreground">
              Where users upgrade, churn, or pause engagement across resume and job
              workflows.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-surface/70 p-4">
              <span>Resume builder → AI enhancements</span>
              <Badge variant="outline">78% completion</Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-surface/70 p-4">
              <span>AI enhancements → Export</span>
              <Badge variant="outline">63% conversion</Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-surface/70 p-4">
              <span>Job compatibility → Applied</span>
              <Badge variant="outline">48% click-through</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-surface/80">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Executive summary</h2>
            <p className="text-sm text-muted-foreground">
              Tailor-made for board updates and investor communications.
            </p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              • Record AI actions month-over-month (+18.9%) demonstrate growing reliance
              on automated workflows.
            </p>
            <p>
              • Resume exports dipped (-4.3%) as we launched iterative enhancements —
              continue monitoring to ensure frictionless exports.
            </p>
            <p>
              • Enterprise trial velocity increased to 32 — prime time to activate
              success-led outreach and refine pricing narratives.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
