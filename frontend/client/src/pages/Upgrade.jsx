import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Check, 
  Zap,
  Sparkles,
  AlertCircle,
  Rocket
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

const plans = [
  {
    id: "free",
    name: "Starter",
    description: "Build a polished resume with core layouts and share-ready exports.",
    badge: "Popular with new grads",
    priceMonthly: 0,
    priceYearly: 0,
    highlights: ["1 active resume", "Core templates", "Basic PDF export"],
    tag: "Current plan",
  },
  {
    id: "pro",
    name: "Professional",
    description: "Unlock premium templates, job tracking, and AI enhancements.",
    badge: "Best value",
    priceMonthly: 19,
    priceYearly: 180,
    highlights: [
      "Unlimited resumes & versions",
      "Premium + ATS templates",
      "AI bullet & summary enhancer",
      "Job tracking dashboard",
    ],
  },
  {
    id: "enterprise",
    name: "Team/Enterprise",
    description: "Collaboration, analytics, and concierge support for career services teams.",
    badge: "Talk to us",
    contactOnly: true,
    highlights: [
      "Team workspaces",
      "Usage analytics",
      "Custom branding",
      "Dedicated success manager",
    ],
  },
];

export default function Upgrade() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { user } = useAuth();

  const currentTier = (user?.tier || "free").toLowerCase();

  const displayPlans = useMemo(
    () =>
      plans.map((plan) => ({
        ...plan,
        price:
          plan.contactOnly || plan.priceMonthly === 0
            ? plan.priceMonthly
            : billingCycle === "monthly"
            ? plan.priceMonthly
            : plan.priceYearly,
        billingLabel:
          plan.contactOnly || plan.priceMonthly === 0
            ? ""
            : billingCycle === "monthly"
            ? "/ month"
            : "/ year",
      })),
    [billingCycle],
  );

  const handleUpgrade = (plan) => {
    if (plan.id === 'enterprise') {
      window.location.href = 'mailto:sales@joblander.com?subject=Enterprise Plan Inquiry';
      return;
    }
    
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <Badge className="mb-4 bg-white text-blue-600 border-blue-200 shadow-sm">
            <Sparkles className="w-4 h-4 mr-1" />
            Upgrade your toolkit
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Level up your JobLander experience
          </h1>
          <p className="text-gray-600">
            Get premium templates, AI enhancements, and insights that help you move from application to offer faster.
          </p>
        </motion.div>

        <div className="flex justify-center gap-3 mb-10">
          <Button
            variant={billingCycle === "monthly" ? "default" : "outline"}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === "yearly" ? "default" : "outline"}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly <Badge className="ml-2 bg-emerald-100 text-emerald-700">Save 20%</Badge>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {displayPlans.map((plan) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card
                className={`relative h-full border-none shadow-xl ${
                  plan.id === "pro" ? "ring-2 ring-purple-400" : ""
                }`}
              >
                <CardHeader className="space-y-4 pb-4">
                  <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-purple-500" />
                    <div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </div>
                  </div>
                  {plan.badge && (
                    <Badge className="w-fit bg-purple-100 text-purple-700 border-purple-200">
                      {plan.badge}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-baseline gap-2">
                    {plan.contactOnly ? (
                      <span className="text-3xl font-semibold text-gray-700">Talk to sales</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-gray-900">
                          {plan.price === 0 ? "Free" : `$${plan.price}`}
                        </span>
                        {plan.billingLabel && (
                          <span className="text-sm text-gray-500">{plan.billingLabel}</span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="space-y-3 text-sm">
                    {plan.highlights.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-gray-700">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => handleUpgrade(plan)}
                    disabled={currentTier === plan.id}
                  >
                    {plan.contactOnly
                      ? "Contact sales"
                      : currentTier === plan.id
                      ? "Current plan"
                      : "Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upgrade to {selectedPlan?.name}</DialogTitle>
              <DialogDescription>
                Billing cycle: {billingCycle === "monthly" ? "Monthly" : "Yearly"} plan
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-gray-600">
              <p>Secure checkout will be available soon. In the meantime, contact us and we’ll help you upgrade.</p>
              <Button
                onClick={() => {
                  window.location.href = "mailto:hello@joblander.com?subject=JobLander Upgrade";
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                Email our team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
