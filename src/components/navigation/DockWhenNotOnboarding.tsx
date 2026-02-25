'use client';

import { usePathname } from 'next/navigation';
import { AppDock } from './AppDock';

export function DockWhenNotOnboarding() {
  const pathname = usePathname();
  if (pathname === '/onboarding') return null;
  return <AppDock />;
}
