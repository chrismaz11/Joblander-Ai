import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: Stripe.LatestApiVersion,
});

export const PRICING_PLANS = {
  download: {
    priceId: 'price_download_onetime',
    amount: 295, // $2.95
    name: 'One-Time Download',
    features: ['Single document download', 'PDF format', 'Valid for 24 hours']
  },
  basic: {
    priceId: 'price_basic_monthly',
    amount: 1495, // $14.95
    name: 'Basic Pro',
    features: ['Unlimited downloads', 'All templates', 'No watermarks', 'Email support']
  },
  professional: {
    priceId: 'price_professional_monthly', 
    amount: 1995, // $19.95
    name: 'Professional',
    features: ['Everything in Basic', 'Custom branding', 'Priority support', 'Advanced analytics']
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

export async function createPaymentIntent(amount: number, customerId: string, metadata?: Record<string, string>) {
  return await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer: customerId,
    automatic_payment_methods: { enabled: true },
    metadata: metadata || {},
  });
}

export async function createDownloadPayment(customerId: string, documentId: string, documentType: string) {
  return await stripe.paymentIntents.create({
    amount: PRICING_PLANS.download.amount,
    currency: 'usd',
    customer: customerId,
    automatic_payment_methods: { enabled: true },
    metadata: {
      type: 'download',
      documentId,
      documentType,
    },
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
