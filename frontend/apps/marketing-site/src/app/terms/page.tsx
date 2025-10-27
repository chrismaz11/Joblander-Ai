import Link from "next/link";

export default function TermsPage() {
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
          Terms & Conditions
        </h1>
        <p className="text-sm text-white/60">
          Last updated {new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <div className="space-y-6 text-sm leading-6 text-white/70">
          <p>
            These sample terms outline placeholders for your legal counsel to
            customize. Add sections covering eligibility, acceptable use,
            payment terms, refunds, intellectual property, disclaimers, and
            governing law.
          </p>
          <p>
            Stripe subscriptions automatically renew until cancelled in-app or
            via the customer portal. Trial cancellations must occur before the
            7th day to avoid the recurring $11.99 charge.
          </p>
          <p>
            Saving resumes requires a Supabase account. You are responsible for
            keeping your login credentials secure and for all activity under
            your account.
          </p>
          <p>
            Export credits are non-transferable but may be refunded within 7
            days if unused. Contact support for assistance.
          </p>
        </div>
      </div>
    </main>
  );
}
