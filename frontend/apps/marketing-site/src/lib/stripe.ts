import Stripe from "stripe";
import { getServerEnv } from "./env";

let stripe: Stripe | null = null;

export const getStripe = () => {
  if (!stripe) {
    const { STRIPE_SECRET_KEY } = getServerEnv();
    stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    });
  }

  return stripe;
};
