'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/auth';
import { connectDb, User } from '@/lib/db';

export interface CompleteOnboardingResult {
  success: boolean;
  error?: string;
}

/**
 * Mark onboarding as complete and optionally save name/business name.
 */
export async function completeOnboarding(data?: {
  name?: string;
  businessName?: string;
}): Promise<CompleteOnboardingResult> {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: 'Not signed in.' };

  try {
    await connectDb();
    const update: { onboardingCompleted: boolean; name?: string; businessName?: string } = {
      onboardingCompleted: true,
    };
    if (data?.name?.trim()) update.name = data.name.trim();
    if (data?.businessName?.trim()) update.businessName = data.businessName.trim();
    await User.findByIdAndUpdate(userId, update);
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (e) {
    console.error('Complete onboarding error:', e);
    return { success: false, error: 'Something went wrong.' };
  }
}
