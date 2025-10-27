import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, 
  Database, 
  Cpu, 
  HardDrive, 
  Wifi, 
  AlertTriangle, 
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Brain,
  Shield,
  FileText
} from "lucide-react";

interface HealthData {
  healthy: boolean;
  status: "healthy" | "warning" | "critical";
  configErrors: string[];
  metadata: any;
  alerts: any[];
  timestamp: string;
}

interface MetricsData {
  summary: {
    totalRequests: number;
    avgLatency: number;
    errorRate: number;
    cacheHitRate: number;
    status: "healthy" | "warning" | "critical";
    alerts: string[];
  };
  aggregated: any;
  byProvider: any;
  byOperation: any;
  costs: any;
  timestamp: string;
}

interface CacheStats {
  stats: {
    hits: number;
    misses: number;
    hitRate: number;
    totalEntries: number;
    memoryUsage: number;
    maxMemory: number;
  };
  topEntries: Array<{
    key: string;
    hits: number;
    lastAccess: string;
    ttl: number;
  }>;
  totalEntries: number;
}

export default function HealthDashboard() {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // Health status query
  const { data: healthData, refetch: refetchHealth, isLoading: healthLoading } = useQuery<HealthData>({
    queryKey: ["/api/admin/llm/health"],
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  // Metrics query
  const { data: metricsData, refetch: refetchMetrics, isLoading: metricsLoading } = useQuery<MetricsData>({
    queryKey: ["/api/admin/llm/metrics"],
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  // Cache stats query
  const { data: cacheData, refetch: refetchCache, isLoading: cacheLoading } = useQuery<CacheStats>({
    queryKey: ["/api/admin/llm/cache/stats"],
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "healthy":
        return "text-green-500 border-green-500 bg-green-50 dark:bg-green-950/30";
      case "warning":
        return "text-yellow-500 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30";
      case "critical":
        return "text-red-500 border-red-500 bg-red-50 dark:bg-red-950/30";
      default:
        return "text-gray-500 border-gray-500 bg-gray-50 dark:bg-gray-950/30";
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const refreshAll = () => {
    refetchHealth();
    refetchMetrics();
    refetchCache();
  };

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">System Health Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor AI services, cache performance, and system metrics
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? "bg-primary/10 border-primary" : ""}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
                Auto Refresh
              </Button>
              
              <Button onClick={refreshAll} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Now
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={`border-2 ${getStatusColor(healthData?.status)}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Services</CardTitle>
              {getStatusIcon(healthData?.status)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{healthData?.status || "Unknown"}</div>
              <p className="text-xs text-muted-foreground">
                {healthData?.configErrors?.length ? 
                  `${healthData.configErrors.length} errors` : 
                  "All systems operational"
                }
              </p>
            </CardContent>
          </Card>

          <Card className={`border-2 ${getStatusColor(metricsData?.summary.status)}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              {metricsData?.summary.avgLatency && metricsData.summary.avgLatency < 2000 ?
                <TrendingUp className="h-5 w-5 text-green-500" /> :
                <TrendingDown className="h-5 w-5 text-yellow-500" />
              }
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsData?.summary.avgLatency ? 
                  `${Math.round(metricsData.summary.avgLatency)}ms` : 
                  "N/A"
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Average response time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
              <Zap className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cacheData?.stats.hitRate ? 
                  `${Math.round(cacheData.stats.hitRate * 100)}%` : 
                  "N/A"
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {cacheData?.stats.totalEntries || 0} cached entries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <Shield className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsData?.summary.errorRate !== undefined ? 
                  `${Math.round(metricsData.summary.errorRate * 100)}%` : 
                  "N/A"
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {(healthData?.alerts?.length || metricsData?.summary.alerts?.length) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Active Alerts</h2>
            <div className="space-y-3">
              {healthData?.configErrors?.map((error, index) => (
                <Alert key={`config-${index}`} className="border-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Configuration Error:</strong> {error}
                  </AlertDescription>
                </Alert>
              ))}
              
              {metricsData?.summary.alerts?.map((alert, index) => (
                <Alert key={`metric-${index}`} className="border-yellow-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Performance Alert:</strong> {alert}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Metrics */}
        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="cache">Cache</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Request Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Requests</span>
                    <span className="font-bold">{metricsData?.summary.totalRequests || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Latency</span>
                    <span className="font-bold">
                      {metricsData?.summary.avgLatency ? 
                        `${Math.round(metricsData.summary.avgLatency)}ms` : 
                        "N/A"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-bold">
                      {metricsData?.summary.errorRate !== undefined ? 
                        `${Math.round(metricsData.summary.errorRate * 100)}%` : 
                        "N/A"
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Service Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {healthData?.metadata && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Provider</span>
                        <Badge variant="outline" className="capitalize">
                          {healthData.metadata.provider || "Unknown"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cache Enabled</span>
                        <Badge variant={healthData.metadata.cacheEnabled ? "default" : "secondary"}>
                          {healthData.metadata.cacheEnabled ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Version</span>
                        <span className="font-mono text-sm">{healthData.metadata.version || "N/A"}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cache Tab */}
          <TabsContent value="cache" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Cache Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cacheData?.stats && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Hit Rate</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={cacheData.stats.hitRate * 100} 
                            className="w-20 h-2" 
                          />
                          <span className="font-bold">
                            {Math.round(cacheData.stats.hitRate * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cache Hits</span>
                        <span className="font-bold">{cacheData.stats.hits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cache Misses</span>
                        <span className="font-bold">{cacheData.stats.misses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Entries</span>
                        <span className="font-bold">{cacheData.stats.totalEntries.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Memory Usage</span>
                        <span className="font-bold">
                          {Math.round(cacheData.stats.memoryUsage / 1024 / 1024)}MB / 
                          {Math.round(cacheData.stats.maxMemory / 1024 / 1024)}MB
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Cache Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {cacheData?.topEntries?.slice(0, 10).map((entry, index) => (
                        <div key={index} className="flex justify-between items-center p-2 rounded border">
                          <div className="flex-1 truncate">
                            <p className="text-sm font-mono truncate">{entry.key}</p>
                            <p className="text-xs text-muted-foreground">
                              Last access: {new Date(entry.lastAccess).toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge variant="secondary">{entry.hits} hits</Badge>
                        </div>
                      )) || (
                        <p className="text-muted-foreground text-center py-4">No cache entries</p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Provider Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metricsData?.byProvider ? (
                  <div className="space-y-4">
                    {Object.entries(metricsData.byProvider).map(([provider, stats]: [string, any]) => (
                      <div key={provider} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold capitalize">{provider}</h3>
                          <Badge variant={stats.errorRate < 0.05 ? "default" : "destructive"}>
                            {Math.round(stats.errorRate * 100)}% errors
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Requests</p>
                            <p className="font-bold">{stats.totalRequests || 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Avg Latency</p>
                            <p className="font-bold">{Math.round(stats.avgLatency || 0)}ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Cache Hit Rate</p>
                            <p className="font-bold">{Math.round((stats.cacheHitRate || 0) * 100)}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No provider data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Operation Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metricsData?.byOperation ? (
                  <div className="space-y-4">
                    {Object.entries(metricsData.byOperation).map(([operation, stats]: [string, any]) => (
                      <div key={operation} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold">{operation.replace(/([A-Z])/g, ' $1').trim()}</h3>
                          <Badge variant={stats.errorRate < 0.05 ? "default" : "destructive"}>
                            {Math.round(stats.errorRate * 100)}% errors
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Requests</p>
                            <p className="font-bold">{stats.totalRequests || 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Avg Latency</p>
                            <p className="font-bold">{Math.round(stats.avgLatency || 0)}ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Cache Hit Rate</p>
                            <p className="font-bold">{Math.round((stats.cacheHitRate || 0) * 100)}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No operation data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last updated: {healthData?.timestamp ? 
                new Date(healthData.timestamp).toLocaleString() : 
                "Never"
              }
            </div>
            <div>
              Job-Lander System Health Dashboard v1.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}