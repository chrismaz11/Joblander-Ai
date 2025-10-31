# OAuth Setup Instructions

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `https://cnxbjetktgfraaxkfuhk.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
7. Copy Client ID and Client Secret

## GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: JobLander
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL: `https://cnxbjetktgfraaxkfuhk.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret

## Supabase Configuration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: cnxbjetktgfraaxkfuhk
3. Go to Authentication → Providers
4. Enable Google:
   - Paste Google Client ID
   - Paste Google Client Secret
5. Enable GitHub:
   - Paste GitHub Client ID  
   - Paste GitHub Client Secret
6. Save changes

## Testing

After setup, the Google and GitHub sign-in buttons should work properly and redirect users through the OAuth flow.
