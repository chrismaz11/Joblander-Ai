import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Copy,
  Download,
  Palette,
  FileText,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToneSelector, type Tone } from "./ToneSelector";

interface CoverLetterVariants {
  professional?: string;
  concise?: string;
  bold?: string;
}

interface CoverLetterEditorProps {
  variants: CoverLetterVariants;
  companyName: string;
  position: string;
  onSave?: (tone: Tone, content: string) => void;
  className?: string;
}

export function CoverLetterEditor({
  variants,
  companyName,
  position,
  onSave,
  className,
}: CoverLetterEditorProps) {
  const { toast } = useToast();
  const [selectedTone, setSelectedTone] = useState<Tone>("professional");
  const [editedVariants, setEditedVariants] = useState<CoverLetterVariants>(variants);
  const [viewMode, setViewMode] = useState<"tabs" | "comparison">("tabs");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setEditedVariants(variants);
  }, [variants]);

  const currentContent = editedVariants[selectedTone] || "";
  const wordCount = currentContent.trim().split(/\s+/).filter(Boolean).length;
  const charCount = currentContent.length;

  const handleContentChange = (tone: Tone, value: string) => {
    setEditedVariants((prev) => ({
      ...prev,
      [tone]: value,
    }));
    onSave?.(tone, value);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      toast({
        title: "Copied to clipboard",
        description: `${selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)} version copied successfully.`,
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try selecting and copying manually.",
        variant: "destructive",
      });
    }
  };

  const downloadAsPDF = () => {
    const element = document.createElement("a");
    const file = new Blob([currentContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${companyName}-${position}-${selectedTone}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded",
      description: "Cover letter downloaded successfully.",
    });
  };

  const renderEditor = (tone: Tone, content: string) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {tone}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {content.trim().split(/\s+/).filter(Boolean).length} words • {content.length} characters
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedTone(tone);
              copyToClipboard();
            }}
            data-testid={`button-copy-${tone}`}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>
      <Textarea
        value={content}
        onChange={(e) => handleContentChange(tone, e.target.value)}
        placeholder="Your cover letter will appear here..."
        className={cn(
          "min-h-[400px] font-serif text-base leading-relaxed",
          isExpanded && "min-h-[600px]"
        )}
        data-testid={`textarea-coverletter-${tone}`}
      />
    </div>
  );

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cover Letter Preview</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setViewMode(viewMode === "tabs" ? "comparison" : "tabs")}
              data-testid="button-toggle-view"
            >
              {viewMode === "tabs" ? (
                <>
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Compare
                </>
              ) : (
                <>
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Tabs
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid="button-toggle-expand"
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {viewMode === "tabs" ? (
          <>
            <ToneSelector
              selectedTone={selectedTone}
              onToneChange={setSelectedTone}
            />
            <Tabs value={selectedTone} onValueChange={(v) => setSelectedTone(v as Tone)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="professional" data-testid="tab-professional">
                  Professional
                </TabsTrigger>
                <TabsTrigger value="concise" data-testid="tab-concise">
                  Concise
                </TabsTrigger>
                <TabsTrigger value="bold" data-testid="tab-bold">
                  Bold
                </TabsTrigger>
              </TabsList>
              <TabsContent value="professional" className="mt-6">
                {renderEditor("professional", editedVariants.professional || "")}
              </TabsContent>
              <TabsContent value="concise" className="mt-6">
                {renderEditor("concise", editedVariants.concise || "")}
              </TabsContent>
              <TabsContent value="bold" className="mt-6">
                {renderEditor("bold", editedVariants.bold || "")}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["professional", "concise", "bold"] as Tone[]).map((tone) => (
              <div key={tone} className="space-y-2">
                <h3 className="font-semibold capitalize text-center p-2 bg-muted rounded-md">
                  {tone}
                </h3>
                {renderEditor(tone, editedVariants[tone] || "")}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {wordCount} words • {charCount} characters
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={copyToClipboard}
              data-testid="button-copy-main"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button
              variant="outline"
              onClick={downloadAsPDF}
              data-testid="button-download"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}