import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ResumeUploader({ onCancel, onComplete }) {
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const parsed = await apiRequest("POST", "/api/parse-resume", formData);

      toast({
        title: "Resume parsed",
        description: "We extracted the key details. Review and enhance it before saving.",
      });

      onComplete?.(parsed);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message || "We couldn't parse that file. Please try another format.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Upload Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Upload a PDF or DOCX file. We'll parse the content and create a structured draft you can refine.
        </p>
        <Input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={isUploading} />
        {fileName && (
          <div className="flex items-center gap-3 text-sm text-blue-700">
            <FileText className="w-4 h-4" />
            <span>{fileName}</span>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isUploading}>
            Cancel
          </Button>
          {isUploading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Parsing...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
