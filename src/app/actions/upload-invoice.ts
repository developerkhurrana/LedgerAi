'use server';

import { connectDb, Transaction } from '@/lib/db';
import { parseInvoiceText } from '@/lib/ai/invoice-parser';
import { gstFromInclusive } from '@/lib/gst/calculator';

export interface UploadInvoiceResult {
  success: boolean;
  error?: string;
  transactionId?: string;
  parsed?: { vendorName: string; invoiceNumber: string; amount: number; currency: string; gstPercent: number; date: string };
}

/**
 * Extract text from file (PDF or image) and parse via OpenAI, then save as expense.
 * For images we use a simple approach: pass base64 to OpenAI vision if needed; for MVP we use text extraction only.
 * PDF: use pdf-parse. Image: for MVP we could use OCR or OpenAI vision - here we accept PDF primarily.
 */
async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === 'application/pdf') {
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    return (data as { text: string }).text ?? '';
  }
  // Image: OpenAI vision can accept image URL or base64. For server action we'd need to pass base64.
  // For MVP we return empty so client can show "PDF only" or we add image support later.
  return '';
}

/**
 * Process uploaded file: extract text, parse with OpenAI, save as expense transaction.
 */
export async function processInvoiceUpload(
  userId: string,
  formData: FormData
): Promise<UploadInvoiceResult> {
  if (!userId) return { success: false, error: 'Unauthorized' };

  const file = formData.get('file') as File | null;
  if (!file?.size) return { success: false, error: 'No file provided.' };

  const mime = file.type;
  if (mime !== 'application/pdf') {
    return { success: false, error: 'Only PDF invoices are supported for now.' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const rawText = await extractTextFromBuffer(buffer, mime);
    if (!rawText?.trim()) {
      return { success: false, error: 'Could not extract text from PDF.' };
    }

    const parsed = await parseInvoiceText(rawText);
    if (!parsed || parsed.amount <= 0) {
      return { success: false, error: 'Could not parse invoice data. Check PDF content.' };
    }

    const currency = parsed.currency ?? 'INR';
    const isINR = currency === 'INR';
    const gstPercent = isINR ? (parsed.gstPercent ?? 0) : 0;
    const gstAmount = isINR && gstPercent > 0 ? gstFromInclusive(parsed.amount, gstPercent) : 0;
    const date = parsed.date ? new Date(parsed.date) : new Date();
    if (isNaN(date.getTime())) date.setTime(Date.now());

    await connectDb();
    const doc = await Transaction.create({
      userId,
      type: 'expense',
      vendorName: parsed.vendorName || 'Unknown',
      amount: parsed.amount,
      currency,
      gstPercent,
      gstAmount,
      category: 'General',
      invoiceNumber: parsed.invoiceNumber || undefined,
      date,
    });

    return {
      success: true,
      transactionId: doc._id.toString(),
      parsed: {
        vendorName: parsed.vendorName,
        invoiceNumber: parsed.invoiceNumber,
        amount: parsed.amount,
        currency: parsed.currency,
        gstPercent: parsed.gstPercent,
        date: parsed.date,
      },
    };
  } catch (e) {
    console.error('Upload invoice error:', e);
    return { success: false, error: 'Failed to process invoice.' };
  }
}
