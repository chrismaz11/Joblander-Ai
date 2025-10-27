import { ReactNode, useEffect } from "react";
import { Sidebar } from "@/layout/Sidebar";
import { TopBar } from "@/layout/TopBar";
import { AIAssistantDock } from "@/components/shared/AIAssistantDock";
import { useAppStore } from "@/context/appStore";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground transition-colors">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-6 pb-12 pt-6 lg:px-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
      <AIAssistantDock />
    </div>
  );
};
