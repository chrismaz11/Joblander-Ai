import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileText, Search, Eye, Loader2, Sparkles, Zap, Star } from "lucide-react";
import { Link } from "wouter";
import { getTemplateImage } from "@/lib/templateImages";

const TEMPLATE_CATEGORIES = ["All", "Modern Professional", "Minimalist", "Creative", "Executive", "Student", "Tech"];

interface Template {
  id: string;
  name: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  tags?: string[];
  isPremium?: string;
}

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: templatesData, isLoading } = useQuery<Template[]>({
  });

  const templates: Template[] = templatesData || [];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Modern Professional": return "bg-primary/10 text-primary border-primary/30";
      case "Minimalist": return "bg-secondary/10 text-secondary-foreground border-secondary";
      case "Creative": return "bg-chart-2/10 text-chart-2 border-chart-2/30";
      case "Executive": return "bg-chart-4/10 text-chart-4 border-chart-4/30";
      case "Student": return "bg-chart-3/10 text-chart-3 border-chart-3/30";
      case "Tech": return "bg-chart-1/10 text-chart-1 border-chart-1/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge className="bg-primary/20 text-primary border-primary/30" data-testid="badge-templates">
              <Sparkles className="h-3 w-3 mr-1" />
              50+ Professional Templates
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Perfect Resume Template
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each template is optimized for ATS systems and recruiter preferences.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search templates by name, style, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-templates"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full h-auto flex-wrap justify-center gap-2 p-1 bg-muted/30">
              {TEMPLATE_CATEGORIES.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  data-testid={`tab-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="data-[state=active]:bg-background"
                >
                  {category === "All" && <Sparkles className="h-3 w-3 mr-1" />}
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => {
              const imageUrl = template.thumbnailUrl ? getTemplateImage(template.thumbnailUrl) : null;
              
              return (
                <Card
                  key={template.id}
                  className="group overflow-hidden hover-elevate transition-all duration-300 hover:scale-[1.02]"
                  data-testid={`card-template-${template.id}`}
                >
                  {/* Template Preview */}
                  <div className="aspect-[8.5/11] bg-muted relative overflow-hidden">
                    {imageUrl ? (
                      <img 
                        src={imageUrl}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-card">
                        <FileText className="h-24 w-24 text-muted-foreground/20" />
                      </div>
                    )}
                    
                    {/* Premium Badge */}
                    {template.isPremium === "true" && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-chart-4/90 text-white border-chart-4">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Premium
                        </Badge>
                      </div>
                    )}
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                      <Button
                        onClick={() => handlePreview(template)}
                        variant="secondary"
                        size="sm"
                        className="hover:scale-105 transition-transform"
                        data-testid={`button-preview-${template.id}`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base line-clamp-1" data-testid={`text-template-name-${template.id}`}>
                        {template.name}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`${getCategoryColor(template.category)} text-xs shrink-0`}
                        data-testid={`badge-category-${template.id}`}
                      >
                        {template.category}
                      </Badge>
                    </div>
                    
                    {template.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        asChild 
                        className="flex-1" 
                        size="sm"
                        data-testid={`button-use-template-${template.id}`}
                      >
                        <Link href={`/create?template=${template.id}`}>
                          <Zap className="h-3 w-3 mr-1" />
                          Use Template
                        </Link>
                      </Button>
                      <Button
                        onClick={() => handlePreview(template)}
                        variant="outline"
                        size="sm"
                        className="px-3"
                        data-testid={`button-quick-view-${template.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-bold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    {selectedTemplate?.name}
                    {selectedTemplate?.isPremium === "true" && (
                      <Badge className="bg-chart-4/90 text-white border-chart-4">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Premium
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription className="mt-2">
                  </DialogDescription>
                </div>
                <Badge 
                  className={`${getCategoryColor(selectedTemplate?.category || "")} shrink-0`}
                >
                  {selectedTemplate?.category}
                </Badge>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-auto">
              <div className="aspect-[8.5/11] bg-muted rounded-lg overflow-hidden">
                {selectedTemplate?.thumbnailUrl ? (
                  <img 
                    src={getTemplateImage(selectedTemplate.thumbnailUrl)}
                    alt={selectedTemplate.name}
                    className="w-full h-full object-contain bg-white dark:bg-gray-950"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-32 w-32 text-muted-foreground/20" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button 
                asChild 
                className="flex-1" 
                size="lg"
                data-testid="button-use-template-preview"
              >
                <Link href={`/create?template=${selectedTemplate?.id}`}>
                  <Zap className="h-4 w-4 mr-2" />
                  Use This Template
                </Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setPreviewOpen(false)} 
                size="lg"
              >
                Close Preview
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
