import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: (failureCount, error) => {
      // Don't retry on 401 Unauthorized
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // If we got a 401, user is definitely not authenticated
  const isAuthenticated = !!(user && !isUnauthorizedError(error as Error));

  return {
    user: isAuthenticated ? user : undefined,
    isLoading,
    isAuthenticated,
  };
}
