import { MeResponse } from './schemas';

describe('MeResponse', () => {
  it('accepts a user with or without an email', () => {
    const id = '7f3c2d1e-9b8a-4c5d-8e6f-1a2b3c4d5e6f';
    expect(MeResponse.parse({ id, email: 'a@example.com' })).toEqual({ id, email: 'a@example.com' });
    expect(MeResponse.parse({ id, email: null }).email).toBeNull();
  });

  it('rejects a malformed id', () => {
    expect(MeResponse.safeParse({ id: 'nope', email: null }).success).toBe(false);
  });
});
