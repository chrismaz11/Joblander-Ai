import Link from "next/link";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#workflow", label: "Workflow" },
  { href: "/faq", label: "FAQ" },
];

export const Navbar = () => (
  <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 text-white backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-12">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        ResumeLaunch
      </Link>
      <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-white/70 transition hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="hidden text-sm font-semibold text-white/70 transition hover:text-white md:block"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          Start trial
        </Link>
      </div>
    </div>
  </header>
);
