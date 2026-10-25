// Server-only configuration. Values come from .env.local locally and Vercel environment variables when deployed.

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`);
  return value;
}

export const env = {
  supabaseUrl: () => required('SUPABASE_URL'),
  supabasePublishableKey: () => required('SUPABASE_PUBLISHABLE_KEY'),
  /** Bypasses Row Level Security. Only for routes that genuinely need it. */
  supabaseSecretKey: () => required('SUPABASE_SECRET_KEY'),
  /** Comma-separated web origins allowed to call the API, e.g. "http://localhost:8081,https://app.example.com". */
  allowedOrigins: () => (process.env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean),
};
