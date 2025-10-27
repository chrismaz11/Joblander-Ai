import { useAppStore } from "@/context/appStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/utils/format";
import { ShieldCheck, UserCog, Users2 } from "lucide-react";

const adminUsers = [
  {
    id: "admin-1",
    name: "Jordan Michaels",
    tier: "pro",
    status: "Active",
    lastSeen: "2025-02-19T09:22:00Z",
    usage: { resumes: 12, coverLetters: 9, aiActions: 146 },
  },
  {
    id: "admin-2",
    name: "Avery Chen",
    tier: "free",
    status: "Invited",
    lastSeen: "2025-02-17T18:05:00Z",
    usage: { resumes: 2, coverLetters: 1, aiActions: 32 },
  },
  {
    id: "admin-3",
    name: "Malik Osborne",
    tier: "enterprise",
    status: "Active",
    lastSeen: "2025-02-18T11:42:00Z",
    usage: { resumes: 28, coverLetters: 18, aiActions: 420 },
  },
];

export const AdminPanelPage = () => {
  const user = useAppStore((state) => state.user);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="accent">Admin Control Center</Badge>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Manage users, security, and platform health
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Monitor account usage, enforce access controls, and stay ahead of activity
          trends with real-time signals.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <Card className="border border-border/50 bg-surface/80">
          <CardContent className="space-y-2 p-6">
            <Users2 className="h-10 w-10 text-primary" />
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Total accounts
            </p>
            <p className="text-3xl font-semibold text-foreground">4,386</p>
            <p className="text-xs text-muted-foreground">+12.8% month over month</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50 bg-surface/80">
          <CardContent className="space-y-2 p-6">
            <UserCog className="h-10 w-10 text-primary" />
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Active admins
            </p>
            <p className="text-3xl font-semibold text-foreground">28</p>
            <p className="text-xs text-muted-foreground">
              {user.name} is a full-access owner
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/50 bg-surface/80">
          <CardContent className="space-y-2 p-6">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Security posture
            </p>
            <p className="text-3xl font-semibold text-foreground">Excellent</p>
            <p className="text-xs text-muted-foreground">
              MFA enforced • Last audit Feb 12, 2025
            </p>
          </CardContent>
        </Card>
      </section>

      <Card className="border border-border/50 bg-surface/80">
        <CardHeader>
          <h2 className="text-lg font-semibold text-foreground">Account overview</h2>
          <p className="text-sm text-muted-foreground">
            Track user engagement, plan mix, and AI consumption at a glance.
          </p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border/60 text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Tier</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Last seen</th>
                <th className="px-4 py-3 text-left">Usage</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-muted-foreground">
              {adminUsers.map((row) => (
                <tr key={row.id} className="hover:bg-surface/60">
                  <td className="px-4 py-4 text-foreground">{row.name}</td>
                  <td className="px-4 py-4 capitalize">{row.tier}</td>
                  <td className="px-4 py-4">
                    <Badge variant="outline">{row.status}</Badge>
                  </td>
                  <td className="px-4 py-4">{formatDate(row.lastSeen)}</td>
                  <td className="px-4 py-4">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span>Resumes</span>
                        <span>{row.usage.resumes}</span>
                      </div>
                      <Progress value={(row.usage.resumes / 40) * 100} />
                      <div className="flex items-center justify-between">
                        <span>Cover letters</span>
                        <span>{row.usage.coverLetters}</span>
                      </div>
                      <Progress value={(row.usage.coverLetters / 30) * 100} />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button size="sm" variant="ghost" className="text-primary">
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
