import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: Stripe.LatestApiVersion,
});

export const PRICING_PLANS = {
  basic: {
    priceId: 'price_basic_monthly',
    amount: 495, // $4.95
    name: 'Basic Pro',
    features: ['5 resumes/month', 'Basic templates', 'PDF export', 'Email support']
  },
  professional: {
    priceId: 'price_professional_monthly', 
    amount: 995, // $9.95
    name: 'Professional',
    features: ['Unlimited resumes', 'Premium templates', 'Cover letters', 'Priority support']
  },
  enterprise: {
    priceId: 'price_enterprise_monthly',
    amount: 2995, // $29.95
    name: 'Enterprise',
    features: ['Everything in Pro', 'Team management', 'API access', 'Custom branding']
  }
};

export async function createCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name,
  });
}

export async function createSubscription(customerId: string, priceId: string) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });
}

export async function createPaymentIntent(amount: number, customerId: string) {
  return await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer: customerId,
    automatic_payment_methods: { enabled: true },
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function updateSubscription(subscriptionId: string, priceId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return await stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: priceId,
    }],
    proration_behavior: 'create_prorations',
  });
}

export { stripe };
