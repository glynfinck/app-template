import type { NextRequest } from 'next/server';

import { json, preflight } from '@/lib/respond';

export function GET(request: NextRequest) {
  return json(request, { ok: true });
}

export const OPTIONS = preflight;
