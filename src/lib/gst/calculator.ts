/**
 * GST calculation engine for Indian small businesses.
 * Input GST = GST on purchases (expenses); Output GST = GST on sales (income).
 * Net GST Payable = Output GST - Input GST (credit).
 */

export interface GstSummary {
  totalInputGst: number;
  totalOutputGst: number;
  netGstPayable: number;
}

/**
 * Compute GST amount from base amount and percentage.
 * amount is the total (inclusive) or base (exclusive) depending on context.
 * We treat amount as inclusive: gstAmount = amount * (gstPercent / (100 + gstPercent)).
 */
export function gstFromInclusive(amountInclusive: number, gstPercent: number): number {
  if (gstPercent <= 0) return 0;
  return (amountInclusive * gstPercent) / (100 + gstPercent);
}

/**
 * Compute base amount from inclusive total.
 */
export function baseFromInclusive(amountInclusive: number, gstPercent: number): number {
  if (gstPercent <= 0) return amountInclusive;
  return amountInclusive / (1 + gstPercent / 100);
}

/**
 * Aggregate input GST (expenses) and output GST (income) from transaction arrays.
 * Expects each transaction to have type, amount, gstAmount.
 */
export function computeGstSummary(
  incomeGstAmount: number,
  expenseGstAmount: number
): GstSummary {
  const totalOutputGst = incomeGstAmount;
  const totalInputGst = expenseGstAmount;
  const netGstPayable = Math.max(0, totalOutputGst - totalInputGst);
  return { totalInputGst, totalOutputGst, netGstPayable };
}
