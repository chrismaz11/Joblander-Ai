const stages = [
  {
    label: "1",
    title: "Sign up with Supabase Auth",
    description:
      "Secure email magic link or social login verifies new members. Free plan users immediately land in the editor with onboarding tips.",
  },
  {
    label: "2",
    title: "Edit with live ATS insights",
    description:
      "Structured sections, drag-and-drop reordering, and AI bullet rewrites keep resumes tight while tracking keyword coverage in real time.",
  },
  {
    label: "3",
    title: "Upgrade when export-ready",
    description:
      "A smart paywall triggers when users preview print mode. Stripe Checkout handles $1.99 trials, recurring subscriptions, and single export credits.",
  },
  {
    label: "4",
    title: "Deliver flawless exports",
    description:
      "Server-rendered PDFs and DOCX files stream from Vercel functions, logging usage and emailing receipts instantly.",
  },
];

export const Workflow = () => (
  <section className="bg-slate-50 py-24 text-slate-900">
    <div className="mx-auto max-w-5xl px-6 lg:px-12">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Funnel built for conversion and retention.
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Every step nudges free users toward premium exports while protecting
          trust with transparent pricing and controllable billing.
        </p>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {stages.map((stage) => (
          <div
            key={stage.label}
            className="flex gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-base font-semibold text-white">
              {stage.label}
            </span>
            <div>
              <h3 className="text-xl font-semibold">{stage.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{stage.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
