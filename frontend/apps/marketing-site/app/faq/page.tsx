import Link from "next/link";

const faqs = [
  {
    question: "Do I get full access during the $1.99 trial?",
    answer:
      "Yes. Trials include every Pro feature: unlimited templates, exports, AI suggestions, and analytics. Cancel within 7 days to avoid renewing at $11.99 every 4 weeks.",
  },
  {
    question: "What happens to my resumes if I cancel?",
    answer:
      "Your content stays in the cloud. You can keep editing on the Free plan, but exports revert to branded previews until you re-subscribe or use a credit pack.",
  },
  {
    question: "How do single export credits work?",
    answer:
      "Credits cost $4.99 and unlock one PDF or DOCX export. You can apply unused credits toward a subscription later with prorated pricing.",
  },
  {
    question: "Which payment methods are supported?",
    answer:
      "Stripe handles card payments, Apple Pay, Google Pay, and regional wallets. Receipts and subscription management flow through the Stripe Customer Portal.",
  },
];

export default function FAQPage() {
  return (
    <main className="bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl space-y-12 px-6 py-24 lg:px-12">
        <div>
          <Link
            href="/"
            className="text-sm font-semibold text-white/60 transition hover:text-white"
          >
            ← Back to home
          </Link>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">
            Pricing & membership FAQ
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Clear answers on billing, trials, refunds, and export access so your
            members always know what to expect.
          </p>
        </div>
        <div className="space-y-8">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">
                {faq.question}
              </h2>
              <p className="mt-3 text-sm text-white/70">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          Still need help? Email{" "}
          <a className="text-white underline" href="mailto:support@resumelaunch.com">
            support@resumelaunch.com
          </a>{" "}
          or chat with us from your dashboard.
        </div>
      </div>
    </main>
  );
}
