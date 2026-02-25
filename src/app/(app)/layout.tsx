import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Calculator, Settings } from 'lucide-react';
import { DockWhenNotOnboarding } from '@/components/navigation/DockWhenNotOnboarding';
import { OnboardingGuard } from '@/components/onboarding/OnboardingGuard';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user) redirect('/login');

  const onboardingCompleted = session.user.onboardingCompleted ?? false;

  return (
    <OnboardingGuard onboardingCompleted={onboardingCompleted}>
      <div className="min-h-screen bg-background dark">
        <header className="sticky top-0 z-10 border-b border-border bg-card">
          <div className="container flex min-h-14 items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-0">
            <Link
              href="/dashboard"
              className="flex shrink-0 items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-90 sm:gap-2.5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 sm:h-9 sm:w-9">
                <Calculator className="h-4 w-4 text-primary" />
              </span>
              <span className="text-base sm:text-lg">LedgerAI</span>
            </Link>
            <div className="flex min-h-11 min-w-0 items-center gap-2">
              <span
                className="hidden min-w-0 truncate text-xs text-muted-foreground sm:inline sm:text-sm sm:max-w-[200px]"
                title={session.user.email ?? undefined}
              >
                {session.user.email}
              </span>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden min-h-11 touch-manipulation sm:inline-flex sm:min-w-0 sm:px-3"
              >
                <Link href="/profile">Profile</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="min-h-11 min-w-11 shrink-0 touch-manipulation sm:min-w-0 sm:px-3"
              >
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 text-foreground hover:text-foreground sm:rounded-lg sm:bg-primary/10 sm:px-3 sm:py-2"
                  aria-label="Settings"
                >
                  <Settings className="h-5 w-5 shrink-0 text-primary" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="container w-full max-w-6xl px-3 py-4 pb-28 sm:px-4 sm:py-6">
          {children}
        </main>
        <DockWhenNotOnboarding />
      </div>
    </OnboardingGuard>
  );
}
