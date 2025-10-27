import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-12">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-white/70">
            Launching soon · Invite-only beta
          </span>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Land jobs faster with a resume builder that thinks like a recruiter.
          </h1>
          <p className="text-lg text-white/80">
            Build, personalize, and export ATS-safe resumes without leaving your
            browser. Autosave to the cloud, share securely, and unlock premium
            exports once you&lsquo;re ready to apply.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Start 7-day trial for $1.99
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition hover:border-white/40"
            >
              Compare plans
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Unlimited exports for paid members
            </span>
            <span>7-day money-back guarantee</span>
            <span>Stripe-secured checkout</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-10 rounded-3xl bg-gradient-to-br from-emerald-400/30 to-blue-500/40 blur-3xl" />
          <div className="relative mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0_0_80px_rgba(15,23,42,0.45)] backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/70">
                Resume preview
              </span>
              <button className="rounded-md border border-white/10 px-3 py-1 text-xs text-white/60 hover:border-white/20 hover:text-white">
                Switch template
              </button>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-950 p-4">
              <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Jordan Carter
                    </p>
                    <p className="text-xs text-white/60">
                      Product Marketing Manager
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-4 text-xs text-white/70">
                  <div>
                    <p className="font-semibold uppercase tracking-[0.2em] text-white/50">
                      Profile
                    </p>
                    <p className="mt-1 leading-relaxed text-justify">
                      Customer-obsessed marketer with 8+ years launching
                      high-growth SaaS products. Known for blending data-driven
                      insights with storytelling that converts trial users into
                      subscribers.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="font-semibold uppercase tracking-[0.2em] text-white/50">
                        Experience
                      </p>
                      <ul className="mt-1 space-y-2">
                        <li>
                          <p className="font-semibold text-white">
                            Head of Marketing · SaaSCo
                          </p>
                          <p className="text-white/50">2021—Present</p>
                        </li>
                        <li>
                          <p className="font-semibold text-white">
                            Product Marketer · Cloudfy
                          </p>
                          <p className="text-white/50">2018—2021</p>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold uppercase tracking-[0.2em] text-white/50">
                        Skills
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {["GTM Strategy", "Lifecycle Email", "Figma", "HubSpot"].map(
                          (skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-white/10 px-3 py-1 text-white/70"
                            >
                              {skill}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  Export
                </p>
                <p className="text-sm text-white/80">Print-ready PDF</p>
              </div>
              <button className="rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-6 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:brightness-105">
                Unlock with Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
