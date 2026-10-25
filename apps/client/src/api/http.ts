import { ApiError } from '@app/core';

import { getAccessToken } from './auth';

// Every call to apps/api goes through apiFetch: it adds the signed-in user's token and validates
// the response against a shared schema from @app/core.

type Parser<T> = { parse: (data: unknown) => T };

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export async function apiFetch<T>(path: string, schema: Parser<T>, init: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('Missing EXPO_PUBLIC_API_URL. Copy .env.example to .env.local and fill it in.');
  }

  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const token = await getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsed = ApiError.safeParse(body);
    throw new ApiRequestError(response.status, parsed.success ? parsed.data.error : `Request failed (${response.status})`);
  }
  return schema.parse(body);
}
