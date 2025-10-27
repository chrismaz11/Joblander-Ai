import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getServerEnv } from "@/lib/env";

export async function POST(request: Request) {
  let stripe;
  try {
    stripe = getStripe();
  } catch (error) {
    console.error("[stripe-webhook] Stripe not configured", error);
    return NextResponse.json({ received: false }, { status: 500 });
  }
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  let STRIPE_WEBHOOK_SECRET: string | undefined;
  try {
    ({ STRIPE_WEBHOOK_SECRET } = getServerEnv());
  } catch (error) {
    console.warn("[stripe-webhook] STRIPE_WEBHOOK_SECRET missing", error);
  }

  if (!STRIPE_WEBHOOK_SECRET) {
    console.warn(
      "[stripe-webhook] STRIPE_WEBHOOK_SECRET missing. Events will not be verified.",
    );
  }

  let event;

  try {
    event = STRIPE_WEBHOOK_SECRET
      ? stripe.webhooks.constructEvent(body, signature as string, STRIPE_WEBHOOK_SECRET)
      : JSON.parse(body);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed", err);
    return NextResponse.json({ received: false }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.info("[stripe-webhook] checkout.session.completed", event.data.object.id);
      break;
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "invoice.paid":
      console.info("[stripe-webhook] subscription lifecycle event", event.type);
      break;
    default:
      console.info("[stripe-webhook] unhandled event", event.type);
  }

  return NextResponse.json({ received: true });
}
