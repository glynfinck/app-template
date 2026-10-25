import { MeResponse } from '@app/core';
import type { NextRequest } from 'next/server';

import { requireUser } from '@/lib/auth';
import { json, preflight } from '@/lib/respond';

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if ('response' in auth) return auth.response;

  return json(request, MeResponse.parse({ id: auth.user.id, email: auth.user.email ?? null }));
}

export const OPTIONS = preflight;
