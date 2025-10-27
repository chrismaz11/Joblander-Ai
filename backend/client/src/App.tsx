import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppLayout } from "@/layout/AppLayout";
import { appRoutes } from "@/routes";

const App = () => (
  <AppLayout>
    <Suspense
      fallback={
        <div className="flex h-full min-h-[60vh] items-center justify-center text-muted-foreground">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading workspace…
          </span>
        </div>
      }
    >
      <Routes>
        {appRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={<route.component />} />
        ))}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  </AppLayout>
);

export default App;
