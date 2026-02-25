import Link from 'next/link';
import { getServerSession } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Calculator, FileSpreadsheet, TrendingUp } from 'lucide-react';

export default async function HomePage() {
  const session = await getServerSession();

  if (session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-3 py-4 sm:p-4">
        <div className="rounded-2xl border border-border bg-card px-6 py-5 text-center shadow-none sm:px-8 sm:py-6">
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <p className="mt-1 max-w-[85vw] truncate font-medium sm:max-w-none">{session.user.email}</p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:max-w-xs sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/api/auth/signout">Sign out</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-3 py-8 sm:px-4 sm:py-12">
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 sm:h-16 sm:w-16">
          <Calculator className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">LedgerAI</h1>
        <p className="mt-2 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
          AI-powered expense, GST, and cash flow tracker for Indian small businesses.
        </p>

        <ul className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-medium text-muted-foreground sm:gap-3 sm:text-sm">
          <li className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2">
            <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
            Expense & income
          </li>
          <li className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2">
            <Calculator className="h-3.5 w-3.5 text-primary" />
            GST tracking
          </li>
          <li className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Cash flow
          </li>
        </ul>

        <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:max-w-sm sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="h-12 w-full text-base font-semibold sm:w-auto sm:px-8">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 w-full text-base font-medium sm:w-auto sm:px-8">
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
