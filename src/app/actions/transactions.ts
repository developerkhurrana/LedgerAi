'use server';

import { connectDb, Transaction } from '@/lib/db';
import type { TransactionType } from '@/lib/db';
import { gstFromInclusive } from '@/lib/gst/calculator';

export interface CreateTransactionInput {
  type: TransactionType;
  vendorName: string;
  amount: number;
  currency?: string; // ISO 4217, default INR
  gstPercent?: number;
  category: string;
  invoiceNumber?: string;
  date: string;
}

export interface TransactionResult {
  success: boolean;
  error?: string;
  id?: string;
}

/**
 * Create a transaction. Multi-tenant: userId from session must be passed by caller.
 */
export async function createTransaction(
  userId: string,
  input: CreateTransactionInput
): Promise<TransactionResult> {
  if (!userId) return { success: false, error: 'Unauthorized' };

  const gstPercent = input.gstPercent ?? 0;
  const gstAmount = gstPercent > 0 ? gstFromInclusive(input.amount, gstPercent) : 0;

  try {
    await connectDb();
    const currency = (input.currency ?? 'INR').toUpperCase().trim().slice(0, 3) || 'INR';
  const doc = await Transaction.create({
      userId,
      type: input.type,
      vendorName: input.vendorName.trim(),
      amount: input.amount,
      currency,
      gstPercent,
      gstAmount,
      category: input.category.trim(),
      invoiceNumber: input.invoiceNumber?.trim(),
      date: new Date(input.date),
    });
    return { success: true, id: doc._id.toString() };
  } catch (e) {
    console.error('Create transaction error:', e);
    return { success: false, error: 'Failed to save transaction.' };
  }
}

export interface ListTransactionsOptions {
  userId: string;
  type?: TransactionType;
  category?: string;
  /** Search in vendor name and invoice number (case-insensitive). */
  search?: string;
  from?: string;
  to?: string;
  limit?: number;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * List transactions for the user (multi-tenant). Optional date range, type, category, and search.
 */
export async function listTransactions(options: ListTransactionsOptions) {
  const { userId, type, category, search, from, to, limit = 100 } = options;
  if (!userId) return [];

  await connectDb();
  const query: Record<string, unknown> = { userId };
  if (type) query.type = type;
  if (category) query.category = category;
  const searchTrim = search?.trim();
  if (searchTrim) {
    const pattern = escapeRegex(searchTrim);
    query.$or = [
      { vendorName: { $regex: pattern, $options: 'i' } },
      { invoiceNumber: { $regex: pattern, $options: 'i' } },
    ];
  }
  if (from || to) {
    query.date = {};
    if (from) (query.date as Record<string, Date>).$gte = new Date(from);
    if (to) (query.date as Record<string, Date>).$lte = new Date(to);
  }

  const list = await Transaction.find(query)
    .sort({ date: -1 })
    .limit(limit)
    .lean();

  return list.map((t) => ({
    id: t._id.toString(),
    type: t.type,
    vendorName: t.vendorName,
    amount: t.amount,
    currency: (t as { currency?: string }).currency ?? 'INR',
    gstPercent: t.gstPercent,
    gstAmount: t.gstAmount,
    category: t.category,
    invoiceNumber: t.invoiceNumber,
    date: t.date instanceof Date ? t.date.toISOString().slice(0, 10) : String(t.date).slice(0, 10),
    createdAt: t.createdAt,
  }));
}

/**
 * Get a single transaction. Multi-tenant: only the owner can read.
 */
export async function getTransaction(userId: string, transactionId: string) {
  if (!userId) return null;
  await connectDb();
  const t = await Transaction.findOne({ _id: transactionId, userId }).lean();
  if (!t) return null;
  return {
    id: t._id.toString(),
    type: t.type,
    vendorName: t.vendorName,
    amount: t.amount,
    currency: (t as { currency?: string }).currency ?? 'INR',
    gstPercent: t.gstPercent,
    gstAmount: t.gstAmount,
    category: t.category,
    invoiceNumber: t.invoiceNumber ?? undefined,
    date: t.date instanceof Date ? t.date.toISOString().slice(0, 10) : String(t.date).slice(0, 10),
  };
}

export interface UpdateTransactionInput {
  type: TransactionType;
  vendorName: string;
  amount: number;
  currency?: string;
  gstPercent?: number;
  category: string;
  invoiceNumber?: string;
  date: string;
}

/**
 * Update a transaction. Multi-tenant: only the owner can update.
 */
export async function updateTransaction(
  userId: string,
  transactionId: string,
  input: UpdateTransactionInput
): Promise<TransactionResult> {
  if (!userId) return { success: false, error: 'Unauthorized' };

  const gstPercent = input.gstPercent ?? 0;
  const gstAmount = gstPercent > 0 ? gstFromInclusive(input.amount, gstPercent) : 0;

  try {
    await connectDb();
    const currency = (input.currency ?? 'INR').toUpperCase().trim().slice(0, 3) || 'INR';
    const doc = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId },
      {
        type: input.type,
        vendorName: input.vendorName.trim(),
        amount: input.amount,
        currency,
        gstPercent,
        gstAmount,
        category: input.category.trim(),
        invoiceNumber: input.invoiceNumber?.trim(),
        date: new Date(input.date),
      },
      { new: true }
    );
    if (!doc) return { success: false, error: 'Transaction not found or access denied.' };
    return { success: true };
  } catch (e) {
    console.error('Update transaction error:', e);
    return { success: false, error: 'Failed to update transaction.' };
  }
}

/**
 * Delete a transaction. Multi-tenant: only the owner can delete.
 */
export async function deleteTransaction(
  userId: string,
  transactionId: string
): Promise<TransactionResult> {
  if (!userId) return { success: false, error: 'Unauthorized' };
  try {
    await connectDb();
    const doc = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId,
    });
    if (!doc) return { success: false, error: 'Transaction not found or access denied.' };
    return { success: true };
  } catch (e) {
    console.error('Delete transaction error:', e);
    return { success: false, error: 'Failed to delete transaction.' };
  }
}
