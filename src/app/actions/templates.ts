'use server';

import { connectDb, TransactionTemplate } from '@/lib/db';
import type { TransactionType } from '@/lib/db';

export interface CreateTemplateInput {
  name: string;
  type: TransactionType;
  vendorName: string;
  amount: number;
  currency?: string;
  gstPercent?: number;
  category: string;
  invoiceNumber?: string;
}

export interface TemplateResult {
  success: boolean;
  error?: string;
  id?: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  type: TransactionType;
  vendorName: string;
  amount: number;
  currency: string;
  gstPercent: number;
  category: string;
  invoiceNumber?: string;
}

/**
 * Create a transaction template. Multi-tenant: userId from session.
 */
export async function createTemplate(
  userId: string,
  input: CreateTemplateInput
): Promise<TemplateResult> {
  if (!userId) return { success: false, error: 'Unauthorized' };
  const name = input.name?.trim();
  if (!name) return { success: false, error: 'Template name is required.' };

  try {
    await connectDb();
    const currency = (input.currency ?? 'INR').toUpperCase().trim().slice(0, 3) || 'INR';
    const doc = await TransactionTemplate.create({
      userId,
      name,
      type: input.type,
      vendorName: input.vendorName.trim(),
      amount: input.amount,
      currency,
      gstPercent: input.gstPercent ?? 0,
      category: input.category.trim(),
      invoiceNumber: input.invoiceNumber?.trim(),
    });
    return { success: true, id: doc._id.toString() };
  } catch (e) {
    console.error('Create template error:', e);
    return { success: false, error: 'Failed to save template.' };
  }
}

/**
 * List templates for the user.
 */
export async function listTemplates(userId: string): Promise<TemplateItem[]> {
  if (!userId) return [];
  await connectDb();
  const list = await TransactionTemplate.find({ userId }).sort({ name: 1 }).lean();
  return list.map((t) => ({
    id: t._id.toString(),
    name: t.name,
    type: t.type as TransactionType,
    vendorName: t.vendorName,
    amount: t.amount,
    currency: (t as { currency?: string }).currency ?? 'INR',
    gstPercent: t.gstPercent,
    category: t.category,
    invoiceNumber: t.invoiceNumber ?? undefined,
  }));
}

/**
 * Get a single template. Multi-tenant: only owner.
 */
export async function getTemplate(
  userId: string,
  templateId: string
): Promise<TemplateItem | null> {
  if (!userId) return null;
  await connectDb();
  const t = await TransactionTemplate.findOne({ _id: templateId, userId }).lean();
  if (!t) return null;
  return {
    id: t._id.toString(),
    name: t.name,
    type: t.type as TransactionType,
    vendorName: t.vendorName,
    amount: t.amount,
    currency: (t as { currency?: string }).currency ?? 'INR',
    gstPercent: t.gstPercent,
    category: t.category,
    invoiceNumber: t.invoiceNumber ?? undefined,
  };
}

/**
 * Delete a template. Multi-tenant: only owner.
 */
export async function deleteTemplate(
  userId: string,
  templateId: string
): Promise<TemplateResult> {
  if (!userId) return { success: false, error: 'Unauthorized' };
  try {
    await connectDb();
    const doc = await TransactionTemplate.findOneAndDelete({
      _id: templateId,
      userId,
    });
    if (!doc) return { success: false, error: 'Template not found or access denied.' };
    return { success: true };
  } catch (e) {
    console.error('Delete template error:', e);
    return { success: false, error: 'Failed to delete template.' };
  }
}
