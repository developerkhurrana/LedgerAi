import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardMetrics } from '@/app/actions/insights';
import { formatCurrency } from '@/lib/format';
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Receipt, FileOutput, Scale } from 'lucide-react';

interface Props {
  metrics: DashboardMetrics;
}

export function DashboardMetricsCards({ metrics }: Props) {
  const overview = [
    {
      title: 'Total Income',
      value: metrics.totalIncome,
      icon: ArrowDownCircle,
      className: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Total Expenses',
      value: metrics.totalExpenses,
      icon: ArrowUpCircle,
      className: 'text-rose-600 dark:text-rose-400',
    },
    {
      title: 'Net Profit',
      value: metrics.netProfit,
      icon: TrendingUp,
      className: metrics.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
    },
  ];

  const gst = [
    {
      title: 'Input GST',
      value: metrics.totalInputGst,
      subtitle: 'On purchases',
      icon: Receipt,
    },
    {
      title: 'Output GST',
      value: metrics.totalOutputGst,
      subtitle: 'On sales',
      icon: FileOutput,
    },
    {
      title: 'Net GST Payable',
      value: metrics.netGstPayable,
      icon: Scale,
      className: metrics.netGstPayable > 0 ? 'text-amber-600 dark:text-amber-400' : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Overview</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {overview.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.title} className="min-w-0 border-border bg-card shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
                  <span className="rounded-md bg-muted/80 p-1.5">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </span>
                </CardHeader>
                <CardContent>
                  <p className={`break-words text-xl font-semibold tabular-nums sm:text-2xl ${c.className ?? 'text-foreground'}`}>
                    {formatCurrency(c.value)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <div>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">GST</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {gst.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.title} className="min-w-0 border-border bg-card shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
                  <span className="rounded-md bg-muted/80 p-1.5">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </span>
                </CardHeader>
                <CardContent>
                  {c.subtitle && (
                    <p className="text-xs text-muted-foreground">{c.subtitle}</p>
                  )}
                  <p className={`break-words text-xl font-semibold tabular-nums sm:text-2xl ${c.className ?? 'text-foreground'}`}>
                    {formatCurrency(c.value)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
