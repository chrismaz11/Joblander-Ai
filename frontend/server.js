// server.js — JobLander starter API (easy version)

import express from "express";
import bodyParser from "body-parser";
import Stripe from "stripe";
import { loadSecretsToEnv } from "./loadSecrets.js";

const app = express();
app.use(bodyParser.json());

await loadSecretsToEnv(); // loads Cognito, Stripe, DB credentials into process.env

// ✅ Stripe setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Simple test route
app.get("/", (req, res) => {
  res.send("🚀 JobLander backend is live!");
});

// ✅ Stripe checkout route (subscription example)
app.post("/api/checkout", async (req, res) => {
  try {
    const { priceId, email } = req.body;
    const customer = await stripe.customers.create({ email });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://joblander.org/success",
      cancel_url: "https://joblander.org/cancel",
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: "Stripe error", details: err.message });
  }
});

// ✅ Cognito login redirect (Hosted UI)
app.get("/auth/login", (req, res) => {
  const authDomain = process.env.COGNITO_JWKS_URL.split("/.well")[0];
  const clientId = process.env.COGNITO_CLIENT_ID;
  const redirect = encodeURIComponent("https://joblander.org/auth/callback");
  const loginUrl = `${authDomain}/login?response_type=code&client_id=${clientId}&redirect_uri=${redirect}`;
  res.redirect(loginUrl);
});

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    supabase: process.env.SUPABASE_URL ? "connected" : "not configured",
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ JobLander API running at http://localhost:${PORT}`);
});
import serverless from "serverless-http";

const PORT = process.env.PORT || 3000;

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Running at http://localhost:${PORT}`));

// Export for Lambda
export const handler = serverless(app);
