import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Features } from "@/components/marketing/Features";
import { Hero } from "@/components/marketing/Hero";
import { PricingTable } from "@/components/marketing/PricingTable";
import { Workflow } from "@/components/marketing/Workflow";

export default function Home() {
  return (
    <div className="bg-slate-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="workflow">
          <Workflow />
        </div>
        <PricingTable />
      </main>
      <Footer />
    </div>
  );
}
