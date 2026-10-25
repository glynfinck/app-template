import type { NextRequest } from 'next/server';

import { corsHeaders } from './cors';
import { env } from './env';

function cors(request: NextRequest): Record<string, string> {
  return corsHeaders(request.headers.get('origin'), env.allowedOrigins());
}

/** A JSON response with CORS headers for allowed web origins. */
export function json(request: NextRequest, body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: cors(request) });
}

/** An error response in the shared ApiError shape. Never put stack traces or secrets in the message. */
export function error(request: NextRequest, status: number, message: string): Response {
  return json(request, { error: message }, status);
}

/** Answers CORS preflight requests. Export it as OPTIONS from each route. */
export function preflight(request: NextRequest): Response {
  return new Response(null, { status: 204, headers: cors(request) });
}
