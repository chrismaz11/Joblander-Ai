import { useMemo } from "react";
import { useAppStore } from "@/context/appStore";
import { SubscriptionTier } from "@/types";

const tierHierarchy: SubscriptionTier[] = ["free", "pro", "enterprise"];

export const useTierGate = (requiredTier: SubscriptionTier = "free") => {
  const selectedTier = useAppStore((state) => state.selectedTier);
  const setTier = useAppStore((state) => state.setTier);

  const hasAccess = useMemo(() => {
    const currentIndex = tierHierarchy.indexOf(selectedTier);
    const requiredIndex = tierHierarchy.indexOf(requiredTier);
    return currentIndex >= requiredIndex;
  }, [selectedTier, requiredTier]);

  return {
    tier: selectedTier,
    requiredTier,
    hasAccess,
    upgrade: () => setTier("pro"),
  };
};
