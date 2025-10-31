import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-10 px-6 py-24 lg:flex-row lg:items-center lg:px-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight">
            Start your $1.99 trial
          </h1>
          <p className="text-base text-white/70">
            Create an account to unlock premium templates, autosave to the
            cloud, and prepare to export once you upgrade.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            ← Back to homepage
          </Link>
        </div>
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm text-white/60">
            Placeholder signup flow—connect Supabase Auth UI or a custom form
            backed by Supabase client-side auth.
          </p>
        </div>
      </div>
    </main>
  );
}
