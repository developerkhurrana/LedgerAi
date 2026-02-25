'use server';

import bcrypt from 'bcryptjs';
import { connectDb, User } from '@/lib/db';

export interface RegisterResult {
  success: boolean;
  error?: string;
}

/**
 * Register a new user (credentials). Used by sign-up form.
 */
export async function register(
  email: string,
  password: string,
  name?: string
): Promise<RegisterResult> {
  const trimmedEmail = email?.trim().toLowerCase();
  if (!trimmedEmail || !password || password.length < 6) {
    return { success: false, error: 'Valid email and password (min 6 chars) required.' };
  }

  try {
    await connectDb();
    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) return { success: false, error: 'Email already registered.' };

    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      email: trimmedEmail,
      password: hashed,
      name: name?.trim() || undefined,
    });
    return { success: true };
  } catch (e) {
    console.error('Register error:', e);
    return { success: false, error: 'Registration failed. Try again.' };
  }
}
