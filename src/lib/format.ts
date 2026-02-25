/** Supported display currencies (ISO 4217) */
const DISPLAY_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'] as const;

/**
 * Format number as currency. Defaults to INR; pass currency for USD etc.
 */
export function formatCurrency(value: number, currency: string = 'INR'): string {
  const code = DISPLAY_CURRENCIES.includes(currency as (typeof DISPLAY_CURRENCIES)[number])
    ? currency
    : 'INR';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
