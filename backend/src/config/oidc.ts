import { Issuer, generators } from 'openid-client';
import process from 'node:process';
import { z } from 'zod';

// Configuration schema for OIDC
const oidcConfigSchema = z.object({
  DISCOVERY_URL: z.string().url(),
  CLIENT_ID: z.string().min(1),
  CLIENT_SECRET: z.string().min(1),
  REDIRECT_URI: z.string().url(),
});

// Type for OIDC client options
type OIDCConfig = z.infer<typeof oidcConfigSchema>;

let _client: any = null; // openid-client.Client instance
let _config: OIDCConfig | null = null;

/**
 * Initialize the OIDC client by discovering endpoints and creating a client instance
 */
export async function initializeOIDC(envConfig?: Partial<OIDCConfig>) {
  try {
    // Load from environment if not provided
    const config: OIDCConfig = envConfig ?? {
      DISCOVERY_URL: process.env.OAUTH_DISCOVERY_URL || process.env.OIDC_ISSUER!,
      CLIENT_ID: process.env.OAUTH_CLIENT_ID!,
      CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET!,
      REDIRECT_URI: process.env.OAUTH_REDIRECT_URI!,
    };

    // Validate configuration
    _config = oidcConfigSchema.parse(config);

    // Discover the provider's endpoints
    const issuer = await Issuer.discover(_config.DISCOVERY_URL);
    console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata);

    // Create client instance
    _client = new issuer.Client({
      client_id: _config.CLIENT_ID,
      client_secret: _config.CLIENT_SECRET,
      redirect_uris: [_config.REDIRECT_URI],
      response_types: ['code'],
    });

    return _client;
  } catch (error) {
    console.error('Failed to initialize OIDC client:', error);
    throw error;
  }
}

/**
 * Get the OIDC client instance. Initialize if not already done.
 */
export async function getClient() {
  if (!_client) {
    await initializeOIDC();
  }
  return _client;
}

/**
 * Generate an authorization URL with PKCE
 */
export async function generateAuthUrl(options: {
  scope?: string;
  state?: string;
  nonce?: string;
}) {
  const client = await getClient();
  const code_verifier = generators.codeVerifier();
  const code_challenge = generators.codeChallenge(code_verifier);
  
  const url = client.authorizationUrl({
    scope: options.scope || 'openid profile email',
    code_challenge,
    code_challenge_method: 'S256',
    state: options.state || generators.state(),
    nonce: options.nonce || generators.nonce(),
  });

  return {
    url,
    code_verifier,
  };
}

/**
 * Exchange an authorization code for tokens
 */
export async function handleCallback(params: {
  code: string;
  state: string;
  code_verifier: string;
}) {
  const client = await getClient();
  const tokens = await client.callback(
    _config!.REDIRECT_URI,
    { code: params.code, state: params.state },
    { code_verifier: params.code_verifier }
  );

  return tokens;
}

/**
 * Verify an ID token and return the claims
 */
export async function verifyToken(token: string) {
  const client = await getClient();
  const claims = await client.userinfo(token);
  return claims;
}

// Export schemas for type checking
export { oidcConfigSchema };
export type { OIDCConfig };