export const Footer = () => (
  <footer className="bg-slate-950 py-10 text-white">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between lg:px-12">
      <p>© {new Date().getFullYear()} ResumeLaunch. All rights reserved.</p>
      <div className="flex flex-wrap gap-6">
        <a className="transition hover:text-white" href="/terms">
          Terms
        </a>
        <a className="transition hover:text-white" href="/privacy">
          Privacy
        </a>
        <a className="transition hover:text-white" href="/contact">
          Contact
        </a>
        <a className="transition hover:text-white" href="/refund-policy">
          Refund Policy
        </a>
      </div>
    </div>
  </footer>
);
