import Link from "next/link";

export default function CheckoutCancelledPage() {
  return (
    <main className="bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Checkout cancelled
        </h1>
        <p className="text-base text-white/70">
          No worries—your card was not charged. You can continue editing on the
          Free plan and upgrade whenever you are ready to export without a
          watermark.
        </p>
        <Link
          href="/"
          className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
