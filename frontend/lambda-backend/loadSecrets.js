// loadSecrets.js — auto environment loader (simple + v3 SDK)
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const REGION = "us-east-1";
const SECRET_ID = "joblander/prod/config";

export async function loadSecretsToEnv() {
  try {
    const client = new SecretsManagerClient({ region: REGION });
    const response = await client.send(new GetSecretValueCommand({ SecretId: SECRET_ID }));
    const secrets = JSON.parse(response.SecretString);

    for (const [key, value] of Object.entries(secrets)) {
      process.env[key] = value;
    }

    console.log("✅ All secrets loaded into environment variables!");
    return secrets;
  } catch (err) {
    console.error("❌ Error loading secrets:", err.message);
    return null;
  }
}

// Auto-load when called directly
if (process.argv[1].includes("loadSecrets.js")) {
  loadSecretsToEnv().then(() => {
    console.log("Environment ready!");
  });
}
