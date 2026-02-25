'use server';

import { z } from 'zod';
import { connectDb, User } from '@/lib/db';

const businessProfileSchema = z.object({
  businessName: z.string().max(120).optional(),
  legalName: z.string().max(160).optional(),
  gstin: z.string().max(20).optional(),
  pan: z.string().max(20).optional(),
  phone: z.string().max(20).optional(),
  addressLine1: z.string().max(200).optional(),
  addressLine2: z.string().max(200).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(80).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(80).optional(),
  baseCurrency: z.string().max(3).optional(),
  financialYearStartMonth: z.number().int().min(0).max(11).optional(),
});

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;

export interface ProfileResult {
  success: boolean;
  error?: string;
}

export async function updateBusinessProfile(
  userId: string,
  input: BusinessProfileInput
): Promise<ProfileResult> {
  if (!userId) return { success: false, error: 'Unauthorized' };

  const parsed = businessProfileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? 'Invalid business profile data.',
    };
  }

  const data = parsed.data;
  const update: Record<string, unknown> = {
    businessName: data.businessName?.trim() || undefined,
    legalName: data.legalName?.trim() || undefined,
    gstin: data.gstin?.trim() || undefined,
    pan: data.pan?.trim() || undefined,
    phone: data.phone?.trim() || undefined,
    addressLine1: data.addressLine1?.trim() || undefined,
    addressLine2: data.addressLine2?.trim() || undefined,
    city: data.city?.trim() || undefined,
    state: data.state?.trim() || undefined,
    postalCode: data.postalCode?.trim() || undefined,
    country: data.country?.trim() || undefined,
    baseCurrency: data.baseCurrency?.toUpperCase().trim().slice(0, 3) || undefined,
  };

  if (typeof data.financialYearStartMonth === 'number') {
    update.financialYearStartMonth = data.financialYearStartMonth;
  }

  try {
    await connectDb();
    await User.findByIdAndUpdate(userId, update, { new: false });
    return { success: true };
  } catch (e) {
    console.error('updateBusinessProfile error:', e);
    return { success: false, error: 'Failed to update profile.' };
  }
}

