import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="bg-slate-950 text-white">
      <div className="mx-auto max-w-3xl space-y-8 px-6 py-24 lg:px-12">
        <Link
          href="/"
          className="text-sm font-semibold text-white/60 transition hover:text-white"
        >
          ← Back to home
        </Link>
        <h1 className="text-4xl font-semibold tracking-tight">
          Contact Support
        </h1>
        <p className="text-sm text-white/60">
          We typically reply within one business day.
        </p>
        <div className="space-y-6 text-sm leading-6 text-white/70">
          <p>
            • Billing & cancellations:{" "}
            <a className="text-white underline" href="mailto:billing@resumelaunch.com">
              billing@resumelaunch.com
            </a>
          </p>
          <p>
            • Technical support:{" "}
            <a className="text-white underline" href="mailto:support@resumelaunch.com">
              support@resumelaunch.com
            </a>
          </p>
          <p>
            • Partnerships & media:{" "}
            <a className="text-white underline" href="mailto:hello@resumelaunch.com">
              hello@resumelaunch.com
            </a>
          </p>
          <p>
            Prefer live chat? Log in and click “Help” from your dashboard. Chat
            is staffed 9am–6pm ET on weekdays.
          </p>
        </div>
      </div>
    </main>
  );
}
