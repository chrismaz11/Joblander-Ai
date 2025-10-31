import { Footer } from "../src/components/layout/Footer";
import { Navbar } from "../src/components/layout/Navbar";
import { Features } from "../src/components/marketing/Features";
import { Hero } from "../src/components/marketing/Hero";
import { PricingTable } from "../src/components/marketing/PricingTable";
import { Workflow } from "../src/components/marketing/Workflow";

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
