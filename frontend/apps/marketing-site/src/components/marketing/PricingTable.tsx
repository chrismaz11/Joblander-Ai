import type { BillingFrequency } from "@/constants/pricing";
import { planIdToStripePriceEnv, plans } from "@/constants/pricing";

const formatFrequency = (frequency: BillingFrequency) => {
  switch (frequency) {
    case "monthly":
      return "every 4 weeks";
    case "quarterly":
      return "every 3 months";
    case "annual":
      return "per year";
    case "one_time":
      return "one-time purchase";
    default:
      return "";
  }
};

export const PricingTable = () => {
  return (
    <section id="pricing" className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Pricing
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Transparent plans that convert browsers into paid members.
            </h2>
            <p className="text-lg text-white/70">
              Start with a $1.99 trial, cancel anytime, and keep every draft in
              your workspace. Paid tiers unlock watermark-free exports, premium
              templates, and the analytics power stack.
            </p>
          </div>
          <div className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-white/70">
            7-day money-back guarantee · Stripe-secured checkout
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const envVar = planIdToStripePriceEnv[plan.id];
            return (
              <article
                key={plan.id}
                className={`flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg transition ${
                  plan.highlight
                    ? "border-emerald-400/60 bg-emerald-400/10 shadow-emerald-500/20"
                    : "hover:-translate-y-1 hover:border-white/30"
                }`}
              >
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-white/50">
                      {plan.name}
                    </p>
                    <div className="mt-4 flex items-end gap-2">
                      <p className="text-4xl font-semibold text-white">
                        {plan.price}
                      </p>
                      <p className="text-sm text-white/60">
                        {formatFrequency(plan.frequency)}
                      </p>
                    </div>
                    <p className="mt-4 text-sm text-white/70">
                      {plan.description}
                    </p>
                    {plan.trial ? (
                      <p className="mt-3 text-sm font-medium text-emerald-300">
                        {plan.trial.price} for {plan.trial.durationDays} days —
                        full access, cancel anytime.
                      </p>
                    ) : null}
                  </div>
                  <ul className="space-y-3 text-sm text-white/70">
                    {plan.bulletPoints.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  {envVar ? (
                    <form action="/api/checkout" method="post">
                      <input
                        type="hidden"
                        name="stripePriceEnv"
                        value={envVar}
                      />
                      <button
                        type="submit"
                        className={`w-full rounded-full px-6 py-3 text-sm font-semibold transition ${
                          plan.highlight
                            ? "bg-white text-slate-950 hover:bg-slate-100"
                            : "border border-white/20 text-white hover:border-white/40"
                        }`}
                      >
                        {plan.frequency === "one_time"
                          ? "Buy credit"
                          : "Start plan"}
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      className="w-full cursor-not-allowed rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/50"
                    >
                      Coming soon
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
