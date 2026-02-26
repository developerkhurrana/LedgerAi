import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * GSTR-3B is due by the 20th of the month following the tax period.
 * Show reminder from 1st to 20th of current month (for previous month's return).
 */
function getGstReminder(): { show: boolean; message: string; dueDate: Date; periodLabel: string } | null {
  const now = new Date();
  const day = now.getDate();
  if (day > 20) return null; // After due date, no reminder

  const dueDate = new Date(now.getFullYear(), now.getMonth(), 20);
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const periodLabel = format(prevMonth, 'MMMM yyyy');

  return {
    show: true,
    dueDate,
    periodLabel,
    message: `GSTR-3B for ${periodLabel} is due by ${format(dueDate, 'd MMMM yyyy')}.`,
  };
}

export function GstDueBanner() {
  const reminder = getGstReminder();
  if (!reminder) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-foreground"
      role="status"
      aria-live="polite"
    >
      <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="min-w-0 flex-1 text-sm font-medium">
        {reminder.message}
        {' '}
        <a
          href="https://www.gst.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center font-semibold text-amber-700 underline-offset-2 hover:underline dark:text-amber-300"
        >
          File on GST portal →
        </a>
      </p>
      <Link
        href="/overview"
        className="shrink-0 rounded-lg bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-500/30 dark:text-amber-200 dark:hover:bg-amber-500/25"
      >
        View GST in LedgerAI
      </Link>
    </div>
  );
}
