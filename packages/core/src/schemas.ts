import { z } from 'zod';

// Request and response shapes shared by apps/client and apps/api.
// The API validates with these; the client parses responses with them.

export const ApiError = z.object({ error: z.string() });
export type ApiError = z.infer<typeof ApiError>;

export const HealthResponse = z.object({ ok: z.literal(true) });
export type HealthResponse = z.infer<typeof HealthResponse>;

export const MeResponse = z.object({
  id: z.uuid(),
  email: z.email().nullable(),
});
export type MeResponse = z.infer<typeof MeResponse>;
