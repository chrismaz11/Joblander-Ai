import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="bg-slate-950 text-white">
      <div className="mx-auto max-w-3xl space-y-8 px-6 py-24 lg:px-12">
        <Link
          href="/"
          className="text-sm font-semibold text-white/60 transition hover:text-white"
        >
          ← Back to home
        </Link>
        <h1 className="text-4xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-white/60">
          Draft policy—replace with counsel-approved copy before launch.
        </p>
        <div className="space-y-6 text-sm leading-6 text-white/70">
          <p>
            ResumeLaunch stores the minimum data required to operate the app:
            account details (email, name), resume content, usage metrics, and
            billing metadata processed via Stripe. We never sell personal data.
          </p>
          <p>
            Supabase is our managed database and authentication provider.
            Stripe handles payments. Both sub-processors are GDPR-compliant and
            offer data processing addendums for enterprise customers.
          </p>
          <p>
            You may request data export or deletion anytime by emailing{" "}
            <a className="text-white underline" href="mailto:privacy@resumelaunch.com">
              privacy@resumelaunch.com
            </a>
            . Deleting your account will remove stored resumes after a 30-day
            grace period.
          </p>
        </div>
      </div>
    </main>
  );
}
