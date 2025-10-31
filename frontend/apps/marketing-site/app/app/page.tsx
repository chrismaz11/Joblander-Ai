export default function DashboardPlaceholder() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900">
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard coming soon
        </h1>
        <p className="mt-4 text-base text-slate-600">
          This placeholder route represents the authenticated workspace where
          members edit resumes, track applications, and manage exports.
        </p>
      </div>
    </main>
  );
}
