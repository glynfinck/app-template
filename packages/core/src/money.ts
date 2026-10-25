// Money is always stored and calculated as integer cents. Never use floats for money.

export type Cents = number;

/** Throws unless the value is a safe integer number of cents. */
export function assertCents(value: number): Cents {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`Expected integer cents, got ${value}`);
  }
  return value;
}

/** Adds amounts in cents. */
export function addCents(...amounts: Cents[]): Cents {
  return amounts.reduce((sum, amount) => sum + assertCents(amount), 0);
}

/** Formats cents for display, e.g. formatCents(123456, 'CAD', 'en-CA') -> "$1,234.56". */
export function formatCents(cents: Cents, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(assertCents(cents) / 100);
}
