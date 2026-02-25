import { getServerSession } from '@/lib/auth';
import { getDashboardMetrics, getMonthlyInsights } from '@/app/actions/insights';
import { listTransactions } from '@/app/actions/transactions';
import { DashboardMetricsCards } from '@/components/dashboard/DashboardMetricsCards';
import { MonthPicker } from '@/components/dashboard/MonthPicker';
import { startOfMonth, endOfMonth } from 'date-fns';

interface PageProps {
  searchParams: Promise<{ year?: string; month?: string }>;
}

export default async function OverviewPage({ searchParams }: PageProps) {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) return null;

  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year, 10) : now.getFullYear();
  const month = params.month ? parseInt(params.month, 10) : now.getMonth();
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(start);

  const [metrics, transactions] = await Promise.all([
    getDashboardMetrics(userId, year, month),
    listTransactions({ userId, from: start.toISOString(), to: end.toISOString(), limit: 100 }),
  ]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Overview
          </h1>
          <p className="text-sm text-muted-foreground">Income, expenses, and GST for selected month</p>
        </div>
        <MonthPicker currentYear={year} currentMonth={month} basePath="/overview" />
      </div>

      <p className="text-xs text-muted-foreground">
        Totals below are in INR only. For USD and other currencies, open <strong>Transactions</strong>.
      </p>

      {metrics ? (
        <DashboardMetricsCards metrics={metrics} />
      ) : (
        <p className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
          No metrics for this period.
        </p>
      )}

      {transactions.some((t) => t.currency && t.currency !== 'INR') && (
        <p className="rounded-md border border-border/80 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          You have {transactions.filter((t) => t.currency && t.currency !== 'INR').length} transaction(s) in
          USD or other currencies. Open <strong>Transactions</strong> to see full history.
        </p>
      )}
    </div>
  );
}
