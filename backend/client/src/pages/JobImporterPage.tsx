import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileSpreadsheet, Sparkles } from "lucide-react";

export const JobImporterPage = () => {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="accent">CSV Job Importer</Badge>
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Bulk import role pipelines while{" "}
          <span className="text-accent">we build API integrations</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Drag in CSV exports from LinkedIn, Indeed, or Lever. JobLander maps data to
          your workspace schema and runs AI scoring automatically.
        </p>
      </header>

      <Card className="border border-dashed border-primary/40 bg-primary/5">
        <CardHeader className="items-center text-center">
          <div className="rounded-full bg-primary/15 p-4 text-primary">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Drag & drop job listings (.csv)
          </h2>
          <p className="text-sm text-muted-foreground">
            Required columns: title, company, location, description, url (optional).
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/40 bg-surface/80 p-6">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">
              {fileName ?? "No file selected yet"}
            </p>
            <Button
              variant="accent"
              className="gap-2"
              onClick={() => setFileName("neuralbridge_jobs.csv")}
            >
              <Sparkles className="h-4 w-4" />
              Simulate import
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Once imported, JobLander enriches each listing with salary estimates,
            filters, and compatibility scoring. Daily refresh schedules supported.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
