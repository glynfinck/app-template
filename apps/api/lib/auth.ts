import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';

import { error } from './respond';
import { userClient } from './supabase';

/** Extracts the token from an "Authorization: Bearer <token>" header. */
export function getBearerToken(authorization: string | null): string | null {
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);
  return match ? match[1] : null;
}

/**
 * Verifies the caller's Supabase access token. Returns the user and a client that acts as them,
 * or a 401 response to return as-is.
 */
export async function requireUser(
  request: NextRequest,
): Promise<{ user: User; supabase: SupabaseClient } | { response: Response }> {
  const token = getBearerToken(request.headers.get('authorization'));
  if (!token) return { response: error(request, 401, 'Not signed in') };

  const supabase = userClient(token);
  const { data, error: authError } = await supabase.auth.getUser(token);
  if (authError || !data.user) return { response: error(request, 401, 'Invalid or expired session') };

  return { user: data.user, supabase };
}
