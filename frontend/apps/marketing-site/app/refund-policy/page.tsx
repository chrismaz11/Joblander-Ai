import Link from "next/link";

export default function RefundPolicyPage() {
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
          Refund Policy
        </h1>
        <div className="space-y-6 text-sm leading-6 text-white/70">
          <p>
            • Trials: request a refund within 7 days for a no-questions refund.
          </p>
          <p>
            • Subscriptions: pro-rate unused time back to card on cancellation
            within 14 days of renewal.
          </p>
          <p>
            • Export credits: refundable within 7 days if unused. Consumed
            credits are non-refundable.
          </p>
          <p>
            Contact{" "}
            <a className="text-white underline" href="mailto:billing@resumelaunch.com">
              billing@resumelaunch.com
            </a>{" "}
            with your invoice number to initiate a refund.
          </p>
        </div>
      </div>
    </main>
  );
}
