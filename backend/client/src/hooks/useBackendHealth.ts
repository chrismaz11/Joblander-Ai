import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api";

interface HealthResponse {
  status: string;
  timestamp: string;
}

export const useBackendHealth = () =>
  useQuery<HealthResponse>({
    queryKey: ["backend-health"],
    queryFn: async () => {
      try {
        return await apiClient.get<HealthResponse>("/api/health");
      } catch (error) {
        return { status: "unavailable", timestamp: new Date().toISOString() };
      }
    },
    staleTime: 1000 * 60,
  });
