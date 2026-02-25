import Link from 'next/link';
import { getServerSession } from '@/lib/auth';
import { getDashboardMetrics } from '@/app/actions/insights';
import { formatCurrency } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LayoutDashboard,
  Receipt,
  Lightbulb,
  User,
  ArrowRight,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) return null;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const metrics = await getDashboardMetrics(userId, year, month);

  const quickLinks = [
    { href: '/overview', label: 'Overview & GST', icon: LayoutDashboard, description: 'Income, expenses, and GST for the month' },
    { href: '/transactions', label: 'Transactions', icon: Receipt, description: 'Add and manage transactions' },
    { href: '/insights', label: 'Insights', icon: Lightbulb, description: 'AI-generated insights' },
    { href: '/profile', label: 'Profile', icon: User, description: 'Business profile and settings' },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Your financial overview and quick links.
        </p>
      </div>

      {metrics && (
        <section>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            This month at a glance
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-border bg-card shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">Income</CardTitle>
                <ArrowDownCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(metrics.totalIncome)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
                <ArrowUpCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                  {formatCurrency(metrics.totalExpenses)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">Net</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p
                  className={`text-xl font-semibold tabular-nums ${
                    metrics.netProfit >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {formatCurrency(metrics.netProfit)}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Quick links
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card className="border-border bg-card shadow-none transition-colors hover:bg-muted/50">
                  <CardHeader className="grid min-h-[4.5rem] grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-4 sm:py-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 shrink-0 text-primary" />
                    </span>
                    <div className="min-w-0 text-left">
                      <CardTitle className="text-base leading-tight">{item.label}</CardTitle>
                      <p className="mt-1 text-sm leading-snug text-muted-foreground">{item.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
