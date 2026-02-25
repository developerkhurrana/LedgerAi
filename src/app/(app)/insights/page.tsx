import { getServerSession } from '@/lib/auth';
import { getMonthlyInsights } from '@/app/actions/insights';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { MonthPicker } from '@/components/dashboard/MonthPicker';

interface PageProps {
  searchParams: Promise<{ year?: string; month?: string }>;
}

export default async function InsightsPage({ searchParams }: PageProps) {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) return null;

  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year, 10) : now.getFullYear();
  const month = params.month ? parseInt(params.month, 10) : now.getMonth();

  const insights = await getMonthlyInsights(userId, year, month);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Insights
          </h1>
          <p className="text-sm text-muted-foreground">AI-generated insights for the selected month</p>
        </div>
        <MonthPicker currentYear={year} currentMonth={month} basePath="/insights" />
      </div>

      <InsightsPanel insights={insights} />
    </div>
  );
}
