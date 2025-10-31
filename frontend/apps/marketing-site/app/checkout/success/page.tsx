import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Thanks for upgrading 🎉
        </h1>
        <p className="text-base text-white/70">
          Your payment was successful. You now have full access to premium
          templates, exports, and analytics. A receipt is on its way to your
          inbox and you can manage your membership anytime via the Stripe
          Customer Portal.
        </p>
        <Link
          href="/app"
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          Open dashboard
        </Link>
      </div>
    </main>
  );
}
