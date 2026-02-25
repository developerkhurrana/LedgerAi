'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const CATEGORIES = [
  'General',
  'Office Supplies',
  'Travel',
  'Utilities',
  'Rent',
  'Salaries',
  'Marketing',
  'Inventory',
  'Services',
  'Other',
];

interface Props {
  currentYear: number;
  currentMonth: number;
}

export function TransactionFilters({ currentYear, currentMonth }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParam = searchParams.get('search') ?? '';
  const typeParam = searchParams.get('type') ?? '';
  const categoryParam = searchParams.get('category') ?? '';

  const [searchInput, setSearchInput] = useState(searchParam);

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const buildUrl = useCallback(
    (updates: { search?: string; type?: string; category?: string }) => {
      const params = new URLSearchParams();
      params.set('year', String(currentYear));
      params.set('month', String(currentMonth));
      params.set('search', updates.search ?? searchParam);
      params.set('type', updates.type ?? typeParam);
      params.set('category', updates.category ?? categoryParam);
      // Remove empty params so URL is clean
      ['search', 'type', 'category'].forEach((key) => {
        const v = params.get(key);
        if (!v) params.delete(key);
      });
      return `/transactions?${params.toString()}`;
    },
    [currentYear, currentMonth, searchParam, typeParam, categoryParam]
  );

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = searchInput.trim();
    router.push(buildUrl({ search: value }));
  }

  function handleTypeChange(value: string) {
    router.push(buildUrl({ type: value }));
  }

  function handleCategoryChange(value: string) {
    router.push(buildUrl({ category: value }));
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="tx-search" className="text-xs text-muted-foreground">
            Search vendor or invoice
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="tx-search"
              name="search"
              type="search"
              placeholder="Vendor name or invoice number…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
              aria-label="Search by vendor or invoice number"
            />
          </div>
        </div>
        <Button type="submit" variant="secondary" size="default" className="shrink-0 gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Type</Label>
          <Select
            value={typeParam || 'all'}
            onValueChange={(v) => handleTypeChange(v === 'all' ? '' : v)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Category</Label>
          <Select
            value={categoryParam || 'all'}
            onValueChange={(v) => handleCategoryChange(v === 'all' ? '' : v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {(searchParam || typeParam || categoryParam) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="self-end text-muted-foreground hover:text-foreground"
            onClick={() => {
              setSearchInput('');
              router.push(`/transactions?year=${currentYear}&month=${currentMonth}`);
            }}
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
