import { useAppStore } from "@/context/appStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/utils/format";
import { Edit3, Shield, Sparkles } from "lucide-react";

export const ProfilePage = () => {
  const user = useAppStore((state) => state.user);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="accent">User Profile</Badge>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Personalize your{" "}
          <span className="text-accent">JobLander experience</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Update identity, notification preferences, and security controls tied to
          your AI-augmented career workspace.
        </p>
      </header>

      <Card className="border border-border/50 bg-surface/80">
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} />
              ) : (
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.role}</p>
              <Badge variant="outline" className="mt-2 capitalize">
                {user.tier} tier
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2 text-primary">
              <Edit3 className="h-4 w-4" />
              Edit profile
            </Button>
            <Button variant="accent" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Launch career planner
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border/50 bg-surface/80">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Account details</h2>
            <p className="text-sm text-muted-foreground">
              Contact, company, and AI usage indicators.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Email</span>
              <span className="text-foreground">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Company</span>
              <span>{user.company ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last login</span>
              <span>{user.lastLogin ? formatDate(user.lastLogin) : "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>AI credits</span>
              <span>{user.aiCredits}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-surface/80">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Security</h2>
            <p className="text-sm text-muted-foreground">
              Strengthen account controls and compliance.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-surface/70 p-4">
              <div>
                <p className="text-foreground">Multi-factor authentication</p>
                <p>Enabled via authenticator app</p>
              </div>
              <Badge variant="outline" className="text-primary">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-surface/70 p-4">
              <div>
                <p className="text-foreground">Session history</p>
                <p>Review active sessions and revoke access.</p>
              </div>
              <Button size="sm" variant="outline" className="gap-2 text-primary">
                <Shield className="h-4 w-4" />
                Manage sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
