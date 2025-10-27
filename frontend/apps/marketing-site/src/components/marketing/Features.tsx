const features = [
  {
    title: "Editable templates that stay pixel-perfect",
    description:
      "Choose from 20+ professionally designed layouts and edit inline with live feedback. Responsive HTML keeps print exports sharp across devices.",
  },
  {
    title: "Cloud autosave with version history",
    description:
      "Every change syncs instantly to Supabase so members never lose a draft. Paid subscribers unlock full revision history to revisit earlier iterations.",
  },
  {
    title: "AI-assisted writing that respects your voice",
    description:
      "Nudge each bullet to be more impact-focused using tuned prompts that prioritize metrics, action verbs, and industry-specific keywords.",
  },
  {
    title: "ATS & recruiter insights baked in",
    description:
      "Score resumes before exporting, catch keyword gaps, and benchmark against job descriptions to boost callback rates.",
  },
  {
    title: "Secure sharing & export controls",
    description:
      "Free users can share branded links, while paid members download watermark-free PDFs, DOCX files, and produce print kits for recruiters.",
  },
  {
    title: "Upgradeable credit packs",
    description:
      "Need a one-off export? Buy a credit and convert to a subscription later with prorated pricing—no hidden fees or dead-end paywalls.",
  },
];

export const Features = () => (
  <section className="bg-white py-24 text-slate-900">
    <div className="mx-auto max-w-6xl px-6 lg:px-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
          Product pillars
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need to go from draft to interview-ready in one tab.
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          We reverse-engineered the best parts of resume.io and CV-Lite, then
          added data-backed features job seekers actually use.
        </p>
      </div>
      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h3 className="text-xl font-semibold text-slate-900">
              {feature.title}
            </h3>
            <p className="mt-3 text-base text-slate-600">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
