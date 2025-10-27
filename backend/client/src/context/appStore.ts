import { create } from "zustand";
import { persist } from "zustand/middleware";
import { onboardingSteps } from "@/data/mockData";
import { OnboardingStep, SubscriptionTier, UserProfile } from "@/types";

interface UsageSnapshot {
  resumes: number;
  coverLetters: number;
  aiCredits: number;
}

interface AppState {
  user: UserProfile;
  usage: UsageSnapshot;
  onboarding: OnboardingStep[];
  selectedTier: SubscriptionTier;
  theme: "light" | "dark";
  setTier: (tier: SubscriptionTier) => void;
  incrementUsage: (key: keyof UsageSnapshot, amount?: number) => void;
  completeOnboardingStep: (stepId: string) => void;
  resetOnboarding: () => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

const initialUser: UserProfile = {
  id: "user-1",
  name: "Jordan Michaels",
  email: "jordan@joblander.com",
  role: "Director of Product Strategy",
  tier: "pro",
  onboardingComplete: false,
  company: "JobLander",
  lastLogin: "2025-02-19T09:22:00Z",
  avatarUrl: undefined,
  aiCredits: 280,
  resumesCreated: 12,
  coverLettersCreated: 9,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: initialUser,
      usage: {
        resumes: 3,
        coverLetters: 2,
        aiCredits: 24,
      },
      onboarding: onboardingSteps,
      selectedTier: initialUser.tier,
      theme: "dark",
      setTier: (tier) =>
        set((state) => ({
          selectedTier: tier,
          user: { ...state.user, tier },
        })),
      incrementUsage: (key, amount = 1) =>
        set((state) => ({
          usage: {
            ...state.usage,
            [key]: Math.max(0, state.usage[key] + amount),
          },
        })),
      completeOnboardingStep: (stepId) =>
        set((state) => {
          const updated = state.onboarding.map((step) =>
            step.id === stepId ? { ...step, completed: true } : step,
          );
          const onboardingComplete = updated.every((step) => step.completed);
          return {
            onboarding: updated,
            user: { ...state.user, onboardingComplete },
          };
        }),
      resetOnboarding: () =>
        set((state) => ({
          onboarding: onboardingSteps.map((step) => ({
            ...step,
            completed: step.id === "step-profile", // preserve first step
          })),
          user: { ...state.user, onboardingComplete: false },
        })),
      setTheme: (theme) => set(() => ({ theme })),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: "joblander-app-state",
      partialize: (state) => ({
        user: state.user,
        selectedTier: state.selectedTier,
        usage: state.usage,
        onboarding: state.onboarding,
        theme: state.theme,
      }),
    },
  ),
);
