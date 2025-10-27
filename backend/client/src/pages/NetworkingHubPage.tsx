import { networkingContacts } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format";
import { Linkedin, Mail, Sparkles, UserPlus } from "lucide-react";

export const NetworkingHubPage = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="accent">Relationship Intelligence</Badge>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Activate your network with{" "}
          <span className="text-accent">timely, AI-crafted outreach</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          JobLander tracks momentum across warm intros, mutual connections, and
          cold outreach so you never miss a high-value touchpoint.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">
              Outreach command center
            </h2>
            <p className="text-sm text-muted-foreground">
              AI sequences outreach cadences, composes follow-ups, and highlights
              priority relationships every week.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/40 bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                This week&apos;s priorities
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Warm introductions aligned to open director roles.</li>
                <li>• Follow-up on AI roundtable invite from Priya.</li>
                <li>• Share AI governance insights with executive peers.</li>
              </ul>
            </div>
            <Button className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              Generate outreach sequence
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <UserPlus className="h-4 w-4" />
              Import new contacts
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-surface/80">
          <CardContent className="space-y-5 p-6">
            {networkingContacts.map((contact) => (
              <div
                key={contact.id}
                className="rounded-2xl border border-border/40 bg-surface/70 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {contact.title} • {contact.company}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Last interaction {formatDate(contact.lastInteraction)}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {contact.relationship} tie
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {contact.recommendedAction}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button size="sm" variant="outline" className="gap-2 text-primary">
                    <Mail className="h-4 w-4" />
                    Draft email
                  </Button>
                  {contact.linkedin && (
                    <Button size="sm" variant="ghost" className="gap-2 text-muted-foreground">
                      <Linkedin className="h-4 w-4" />
                      View profile
                    </Button>
                  )}
                </div>
                {contact.notes && (
                  <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                    Notes: {contact.notes}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
