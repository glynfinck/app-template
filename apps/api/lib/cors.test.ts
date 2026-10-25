import { corsHeaders } from './cors';

const allowed = ['http://localhost:8081', 'https://app.example.com'];

describe('corsHeaders', () => {
  it('allows listed web origins', () => {
    expect(corsHeaders('https://app.example.com', allowed)['Access-Control-Allow-Origin']).toBe('https://app.example.com');
  });

  it('adds nothing for unlisted origins or native apps (no Origin header)', () => {
    expect(corsHeaders('https://evil.example', allowed)).toEqual({});
    expect(corsHeaders(null, allowed)).toEqual({});
  });
});
