'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { format, subMonths, addMonths, startOfMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentYear: number;
  currentMonth: number; // 0-indexed (0 = Jan)
  /** Base path for month navigation (e.g. /overview, /transactions, /insights) */
  basePath?: string;
}

export function MonthPicker({ currentYear, currentMonth, basePath = '/overview' }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = startOfMonth(new Date(currentYear, currentMonth, 1));
  const prev = subMonths(date, 1);
  const next = addMonths(date, 1);
  const now = new Date();
  const isCurrentMonth = currentYear === now.getFullYear() && currentMonth === now.getMonth();

  function goTo(year: number, month: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', String(year));
    params.set('month', String(month));
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 text-foreground">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 border-border text-foreground hover:bg-muted hover:text-foreground"
        onClick={() => goTo(prev.getFullYear(), prev.getMonth())}
        aria-label="Previous month"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[140px] text-center text-sm font-medium text-foreground">
        {format(date, 'MMMM yyyy')}
        {isCurrentMonth && (
          <span className="ml-1.5 text-xs font-normal text-muted-foreground"> (current)</span>
        )}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 border-border text-foreground hover:bg-muted hover:text-foreground"
        onClick={() => goTo(next.getFullYear(), next.getMonth())}
        aria-label="Next month"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
