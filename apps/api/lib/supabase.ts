import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { env } from './env';

const serverAuth = { persistSession: false, autoRefreshToken: false } as const;

/** Acts as the signed-in user, so Row Level Security applies. Use this by default. */
export function userClient(accessToken: string): SupabaseClient {
  return createClient(env.supabaseUrl(), env.supabasePublishableKey(), {
    auth: serverAuth,
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

/** Bypasses Row Level Security. Only use it when a route genuinely needs to, and say why in a comment there. */
export function adminClient(): SupabaseClient {
  return createClient(env.supabaseUrl(), env.supabaseSecretKey(), { auth: serverAuth });
}
