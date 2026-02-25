'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

export function OnboardingGuard({
  onboardingCompleted,
  children,
}: {
  onboardingCompleted: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!onboardingCompleted && pathname !== '/onboarding') {
      router.replace('/onboarding');
    }
  }, [onboardingCompleted, pathname, router]);

  if (!onboardingCompleted && pathname !== '/onboarding') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Taking you to setup…</p>
      </div>
    );
  }

  return <>{children}</>;
}
