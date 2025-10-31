import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";
import { planIdToStripePriceEnv } from "@/constants/pricing";
import { getStripe } from "@/lib/stripe";

const allowedPriceEnvVars = new Set(Object.values(planIdToStripePriceEnv));

export async function POST(request: Request) {
  const formData = await request.formData();
  const priceEnv = formData.get("stripePriceEnv");

  if (typeof priceEnv !== "string" || !allowedPriceEnvVars.has(priceEnv)) {
    return NextResponse.json(
      { error: "Invalid pricing option requested" },
      { status: 400 },
    );
  }

  const priceId = process.env[priceEnv];
  if (!priceId) {
    return NextResponse.json(
      {
        error: `Missing environment variable ${priceEnv}. Add it to .env.local and your hosting provider before enabling checkout.`,
      },
      { status: 500 },
    );
  }

  let stripe;
  try {
    const { STRIPE_SECRET_KEY } = getServerEnv();
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured on the server." },
        { status: 500 },
      );
    }
    stripe = getStripe();
  } catch (error) {
    console.error("[checkout] missing Stripe env", error);
    return NextResponse.json(
      { error: "Stripe credentials are not set on this environment." },
      { status: 500 },
    );
  }
  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: priceEnv === "STRIPE_PRICE_RESUME_CREDIT" ? "payment" : "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancelled`,
      allow_promotion_codes: true,
    });

    return NextResponse.redirect(session.url as string, { status: 303 });
  } catch (error) {
    console.error("[checkout] session error:", error);
    return NextResponse.json(
      {
        error:
          "We were unable to initiate checkout. Please refresh and try again or contact support if the issue persists.",
      },
      { status: 500 },
    );
  }
}
