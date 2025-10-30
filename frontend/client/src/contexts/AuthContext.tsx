import React, { createContext, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth as useSessionAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextValue {
  user: ReturnType<typeof useSessionAuth>["user"] | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  shouldShowAds: () => boolean;
  hasFeature: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSessionAuth();
  const queryClient = useQueryClient();

  const normalizedTier = (user?.tier || "free").toLowerCase();
  const tierRank = ["free", "basic", "professional", "enterprise"].indexOf(normalizedTier);

  const tierFeatureMap: Record<string, Set<string>> = {
    free: new Set(["core"]),
    basic: new Set(["core", "cover_letters"]),
    professional: new Set([
      "core",
      "cover_letters",
      "premium_templates",
      "ai_assist",
      "ads_free",
      "no_watermark",
      "*",
    ]),
    enterprise: new Set([
      "core",
      "cover_letters",
      "premium_templates",
      "ai_assist",
      "ads_free",
      "no_watermark",
      "enterprise",
      "*",
    ]),
  };

  const shouldShowAds = () => {
    const features = tierFeatureMap[normalizedTier] ?? tierFeatureMap.free;
    return !features.has("ads_free");
  };

  const hasFeature = (feature: string) => {
    const normalizedFeature = feature.toLowerCase().replace(/[\s-]+/g, "_");
    const features = tierFeatureMap[normalizedTier] ?? tierFeatureMap.free;

    if (features.has("*")) {
      return true;
    }
    if (features.has(normalizedFeature)) {
      return true;
    }

    // Fallback: professional & enterprise tiers can access unspecified features
    return tierRank >= 2;
  };

  const handleSignOut = async () => {
    try {
      await apiRequest("POST", "/api/logout");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.href = "/api/login";
    }
  };

  const refreshUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        loading: isLoading,
        signOut: handleSignOut,
        refreshUser,
        shouldShowAds,
        hasFeature,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
