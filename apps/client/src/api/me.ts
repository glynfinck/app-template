import { MeResponse } from '@app/core';

import { apiFetch } from './http';

/** The signed-in user, as seen by apps/api. */
export function getMe(): Promise<MeResponse> {
  return apiFetch('/me', MeResponse);
}
