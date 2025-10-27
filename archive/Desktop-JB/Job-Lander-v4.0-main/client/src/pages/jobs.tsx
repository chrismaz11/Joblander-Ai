import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, MapPin, DollarSign, Briefcase, ExternalLink, Loader2, Sparkles, 
  Filter, ChevronDown, ChevronLeft, ChevronRight, Building2, Clock,
  Home, X, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [remoteFilter, setRemoteFilter] = useState<"yes" | "no" | "any">("any");
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<string>("any");
  const [useAI, setUseAI] = useState(true);
  
  // Active search parameters
  const [activeSearch, setActiveSearch] = useState<any>(null);

  // Fetch available cities for autocomplete
  const { data: citiesData } = useQuery({
    queryKey: ["/api/cities", city],
    enabled: city.length > 1,
  });

  // Fetch job statistics
  const { data: stats } = useQuery({
    queryKey: ["/api/job-stats"],
  });

  // Main job search query
  const { data: jobsData, isLoading, isFetching } = useQuery({
    queryKey: [
      "/api/find-jobs", 
      {
        query: activeSearch?.query,
        city: activeSearch?.city,
        remote: activeSearch?.remote,
        employmentType: activeSearch?.employmentType?.join(','),
        salaryRange: activeSearch?.salaryRange,
        page: currentPage,
        limit: 10,
        useSemanticRanking: useAI
      }
    ],
    enabled: activeSearch !== null,
  });

  const handleSearch = () => {
    if (!searchQuery && !city) return;
    
    setActiveSearch({
      query: searchQuery,
      city: city,
      remote: remoteFilter,
      employmentType: employmentTypes,
      salaryRange: salaryRange !== "any" ? salaryRange : undefined,
    });
    setCurrentPage(1);
  };

  const handleCitySearch = () => {
    if (!city) return;
    
    setActiveSearch({
      query: "",
      city: city,
      remote: remoteFilter,
      employmentType: employmentTypes,
      salaryRange: salaryRange !== "any" ? salaryRange : undefined,
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setRemoteFilter("any");
    setEmploymentTypes([]);
    setSalaryRange("any");
    setCity("");
    setSearchQuery("");
    setActiveSearch(null);
    setCurrentPage(1);
  };

  const toggleEmploymentType = (type: string) => {
    setEmploymentTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-chart-3";
    if (score >= 80) return "text-chart-4";
    if (score >= 70) return "text-chart-2";
    return "text-chart-1";
  };

  const hasActiveFilters = remoteFilter !== "any" || employmentTypes.length > 0 || salaryRange !== "any";
  const displayJobs = (jobsData as any)?.data || [];
  const pagination = (jobsData as any)?.pagination;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse {(stats as any)?.totalJobs || "thousands of"} job opportunities across {(stats as any)?.citiesAvailable || "many"} cities
          </p>
          {stats && (
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{(stats as any).totalJobs}</div>
                <div className="text-sm text-muted-foreground">Total Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{(stats as any).remoteJobs}</div>
                <div className="text-sm text-muted-foreground">Remote Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">${((stats as any).avgSalary / 1000).toFixed(0)}k</div>
                <div className="text-sm text-muted-foreground">Avg Salary</div>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Keywords Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Job title, skills, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                  data-testid="input-job-search"
                />
              </div>

              {/* City Autocomplete */}
              <Popover open={cityOpen} onOpenChange={setCityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={cityOpen}
                    className="w-full justify-between"
                    data-testid="button-city-select"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {city || "Select city..."}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search cities..." 
                      value={city}
                      onValueChange={setCity}
                    />
                    <CommandList>
                      <CommandEmpty>No city found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => {
                            setCity("Remote");
                            setCityOpen(false);
                            handleCitySearch();
                          }}
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Remote
                        </CommandItem>
                        {(citiesData as any)?.cities?.map((c: string) => (
                          <CommandItem
                            key={c}
                            onSelect={() => {
                              setCity(c);
                              setCityOpen(false);
                              handleCitySearch();
                            }}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            {c}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={!searchQuery && !city}
                className="w-full"
                data-testid="button-search-jobs"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Jobs
              </Button>
            </div>

            {/* Filters Section */}
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2">
                        {[remoteFilter !== "any" ? 1 : 0, employmentTypes.length, salaryRange !== "any" ? 1 : 0]
                          .reduce((a, b) => a + b, 0)}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="use-ai"
                      checked={useAI}
                      onCheckedChange={(checked) => setUseAI(checked as boolean)}
                      data-testid="checkbox-ai"
                    />
                    <Label htmlFor="use-ai" className="text-sm cursor-pointer">
                      <Sparkles className="inline h-3 w-3 mr-1" />
                      AI Ranking
                    </Label>
                  </div>
                  
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      data-testid="button-clear-filters"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <CollapsibleContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Remote Filter */}
                  <div className="space-y-2">
                    <Label>Remote Work</Label>
                    <Select value={remoteFilter} onValueChange={(value: any) => setRemoteFilter(value)}>
                      <SelectTrigger data-testid="select-remote">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="yes">Remote Only</SelectItem>
                        <SelectItem value="no">On-site Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Employment Type */}
                  <div className="space-y-2">
                    <Label>Employment Type</Label>
                    <div className="space-y-2">
                      {["Full-time", "Part-time", "Contract", "Internship"].map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={employmentTypes.includes(type)}
                            onCheckedChange={() => toggleEmploymentType(type)}
                            data-testid={`checkbox-${type.toLowerCase()}`}
                          />
                          <Label htmlFor={type} className="text-sm cursor-pointer">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div className="space-y-2">
                    <Label>Salary Range</Label>
                    <Select value={salaryRange} onValueChange={setSalaryRange}>
                      <SelectTrigger data-testid="select-salary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="$0-50k">$0 - $50k</SelectItem>
                        <SelectItem value="$50-100k">$50k - $100k</SelectItem>
                        <SelectItem value="$100-150k">$100k - $150k</SelectItem>
                        <SelectItem value="$150k+">$150k+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </Card>

        {/* Active Filters Display */}
        {activeSearch && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeSearch.query && (
              <Badge variant="secondary" data-testid="badge-query">
                Search: {activeSearch.query}
              </Badge>
            )}
            {activeSearch.city && (
              <Badge variant="secondary" data-testid="badge-city">
                <MapPin className="h-3 w-3 mr-1" />
                {activeSearch.city}
              </Badge>
            )}
            {activeSearch.remote !== "any" && (
              <Badge variant="secondary" data-testid="badge-remote">
                <Home className="h-3 w-3 mr-1" />
                {activeSearch.remote === "yes" ? "Remote" : "On-site"}
              </Badge>
            )}
            {activeSearch.employmentType?.length > 0 && (
              <Badge variant="secondary" data-testid="badge-employment">
                <Briefcase className="h-3 w-3 mr-1" />
                {activeSearch.employmentType.join(", ")}
              </Badge>
            )}
            {activeSearch.salaryRange && (
              <Badge variant="secondary" data-testid="badge-salary">
                <DollarSign className="h-3 w-3 mr-1" />
                {activeSearch.salaryRange}
              </Badge>
            )}
            {useAI && (
              <Badge variant="secondary" className="bg-primary/10" data-testid="badge-ai">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
            )}
          </div>
        )}

        {/* Job Listings */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-32 w-full" />
              </Card>
            ))}
          </div>
        ) : displayJobs.length > 0 ? (
          <>
            <div className="space-y-6">
              {displayJobs.map((job: any, index: number) => (
                <Card
                  key={job.id || index}
                  className="p-6 hover-elevate transition-all"
                  data-testid={`card-job-${index}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {job.remote ? (
                            <Home className="h-6 w-6 text-primary" />
                          ) : (
                            <Building2 className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1" data-testid={`text-job-title-${index}`}>
                            {job.title}
                          </h3>
                          <p className="text-muted-foreground" data-testid={`text-company-${index}`}>
                            {job.company}
                          </p>
                        </div>
                        {job.aiMatchScore && (
                          <Badge 
                            variant="outline" 
                            className={cn("gap-2", getMatchColor(job.aiMatchScore))}
                            data-testid={`badge-match-${index}`}
                          >
                            <Sparkles className="h-3 w-3" />
                            {job.aiMatchScore}% Match
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span data-testid={`text-location-${index}`}>
                            {job.city || job.location || "Remote"}
                          </span>
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span data-testid={`text-salary-${index}`}>{job.salary}</span>
                          </div>
                        )}
                        {job.employmentType && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            <span data-testid={`text-type-${index}`}>{job.employmentType}</span>
                          </div>
                        )}
                        {job.postedDate && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span data-testid={`text-posted-${index}`}>
                              {new Date(job.postedDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2" data-testid={`text-description-${index}`}>
                        {job.description}
                      </p>

                      {job.matchReason && (
                        <p className="text-sm text-muted-foreground italic mb-3">
                          <Sparkles className="inline h-3 w-3 mr-1" />
                          {job.matchReason}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {job.requirements?.slice(0, 4).map((req: string, i: number) => (
                          <Badge key={i} variant="secondary" data-testid={`badge-requirement-${index}-${i}`}>
                            {req}
                          </Badge>
                        ))}
                        {job.requirements?.length > 4 && (
                          <Badge variant="outline">
                            +{job.requirements.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <Button
                        onClick={() => job.jobUrl && window.open(job.jobUrl, '_blank')}
                        disabled={!job.jobUrl}
                        className="flex-1 md:flex-none"
                        data-testid={`button-apply-${index}`}
                      >
                        Apply Now
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 md:flex-none"
                        data-testid={`button-save-${index}`}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.totalJobs)} of {pagination.totalJobs} jobs
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={!pagination.hasPrev || isFetching}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={isFetching}
                          className="w-10"
                          data-testid={`button-page-${pageNum}`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {pagination.totalPages > 5 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={!pagination.hasNext || isFetching}
                    data-testid="button-next-page"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : activeSearch ? (
          <Card className="p-12 text-center">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-bold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or clearing some filters
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-bold mb-2">Start your job search</h3>
            <p className="text-muted-foreground mb-6">
              Enter keywords or select a city to find your next opportunity
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["San Francisco", "New York", "Chicago", "Remote"].map(quickCity => (
                <Button
                  key={quickCity}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCity(quickCity);
                    handleCitySearch();
                  }}
                  data-testid={`button-quick-${quickCity.toLowerCase().replace(' ', '-')}`}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {quickCity}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* AI Suggestions */}
        {!activeSearch && (
          <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">AI-Powered Job Matching</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes job descriptions and ranks them by relevance to your search. 
                  Upload your resume in your profile to get personalized recommendations based on your skills and experience.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}