import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function JobImporter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-xl">
          <CardHeader className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-purple-500" />
            <CardTitle className="text-2xl">Bulk Job Import</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600">
            <p>
              Importing saved jobs from spreadsheets or CSV is coming soon. You’ll be able to upload a file, map fields,
              and automatically populate your JobLander workspace.
            </p>
            <p className="text-sm text-gray-500">
              Need this feature today? Drop us a line at{" "}
              <a href="mailto:hello@joblander.com" className="text-blue-600 underline">
                hello@joblander.com
              </a>{" "}
              and we’ll help you migrate your data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
