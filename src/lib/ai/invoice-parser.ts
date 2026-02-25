import OpenAI from 'openai';

/** Structured output from OpenAI for parsed invoice */
export interface ParsedInvoice {
  vendorName: string;
  invoiceNumber: string;
  amount: number;
  currency: string; // ISO 4217 e.g. INR, USD, EUR
  gstPercent: number;
  date: string;
}

const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'] as const;
function normalizeCurrency(raw: string): string {
  const code = String(raw ?? '').toUpperCase().trim().slice(0, 3);
  if (SUPPORTED_CURRENCIES.includes(code as (typeof SUPPORTED_CURRENCIES)[number])) return code;
  return 'INR'; // default for unknown/missing
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

/**
 * Extract invoice fields from raw text using OpenAI.
 * Returns structured JSON matching ParsedInvoice. Detects currency from invoice (INR, USD, etc.).
 */
export async function parseInvoiceText(rawText: string): Promise<ParsedInvoice | null> {
  if (!openai || !rawText?.trim()) return null;

  const systemPrompt = `You are an expert at extracting invoice/bill data from any country. Given text from an invoice (OCR or copy-paste), return a JSON object with exactly these keys:
- vendorName (string)
- invoiceNumber (string)
- amount (number, the total amount as shown on the invoice - use the numeric value only)
- currency (string, ISO 4217 code: INR for Indian Rupee, USD for US Dollar, EUR for Euro, GBP for British Pound. Detect from symbols like ₹ $ € £ or words like "Rupees", "Dollars", "USD", "INR")
- gstPercent (number, e.g. 18 for 18% - use 0 if not GST or different tax)
- date (string in YYYY-MM-DD)
If something is missing use empty string or 0. For currency use INR only if clearly Indian Rupees, otherwise the currency shown on the invoice. Return only valid JSON, no markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: rawText.slice(0, 6000) },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content) as Record<string, unknown>;
    return {
      vendorName: String(parsed.vendorName ?? ''),
      invoiceNumber: String(parsed.invoiceNumber ?? ''),
      amount: Number(parsed.amount) || 0,
      currency: normalizeCurrency(String(parsed.currency ?? 'INR')),
      gstPercent: Number(parsed.gstPercent) || 0,
      date: String(parsed.date ?? ''),
    };
  } catch {
    return null;
  }
}
