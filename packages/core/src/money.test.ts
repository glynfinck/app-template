import cases from '../fixtures/money.json';
import { addCents, assertCents, formatCents } from './money';

describe('addCents', () => {
  it.each(cases.add)('adds $inputs to $expected', ({ inputs, expected }) => {
    expect(addCents(...inputs)).toBe(expected);
  });

  it('rejects fractional cents', () => {
    expect(() => addCents(100, 0.5)).toThrow('integer cents');
  });
});

describe('formatCents', () => {
  it.each(cases.format)('formats $cents $currency as $expected', ({ cents, currency, locale, expected }) => {
    expect(formatCents(cents, currency, locale)).toBe(expected);
  });
});

describe('assertCents', () => {
  it('rejects NaN and unsafe integers', () => {
    expect(() => assertCents(Number.NaN)).toThrow();
    expect(() => assertCents(Number.MAX_SAFE_INTEGER + 1)).toThrow();
  });
});
