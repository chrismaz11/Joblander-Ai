import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simple route to confirm the API works
app.get("/", (req, res) => {
  res.json({ message: "✅ JobLander API is running on Lambda!" });
});

// Add more API routes here, e.g.
// app.post("/generate", (req, res) => { ... });

const PORT = process.env.PORT || 3000;

// Start server only when running locally (not in Lambda)
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, () => {
    console.log(`✅ Local server running at http://localhost:${PORT}`);
  });
}

// Export handler for Lambda
export const handler = serverless(app);
