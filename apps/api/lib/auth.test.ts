import { getBearerToken } from './auth';

describe('getBearerToken', () => {
  it('reads a bearer token', () => {
    expect(getBearerToken('Bearer abc.def.ghi')).toBe('abc.def.ghi');
    expect(getBearerToken('bearer abc')).toBe('abc');
  });

  it('rejects missing or malformed headers', () => {
    expect(getBearerToken(null)).toBeNull();
    expect(getBearerToken('')).toBeNull();
    expect(getBearerToken('Basic abc')).toBeNull();
    expect(getBearerToken('Bearer')).toBeNull();
    expect(getBearerToken('Bearer a b')).toBeNull();
  });
});
