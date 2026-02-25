'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/format';
import { ListOrdered, Pencil, Trash2 } from 'lucide-react';
import { deleteTransaction } from '@/app/actions/transactions';

export interface TransactionItem {
  id: string;
  type: string;
  vendorName: string;
  amount: number;
  currency: string;
  gstAmount: number;
  category: string;
  invoiceNumber?: string | null;
  date: string;
}

interface Props {
  userId: string;
  transactions: TransactionItem[];
}

export function TransactionListView({ userId, transactions }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    if (!confirm('Delete this transaction? This cannot be undone.')) return;
    const result = await deleteTransaction(userId, id);
    if (result.success) startTransition(() => router.refresh());
    else alert(result.error ?? 'Failed to delete.');
  }

  return (
    <Card className="border-border bg-card shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListOrdered className="h-5 w-5 text-primary" />
          Recent transactions
        </CardTitle>
        <p className="text-xs text-muted-foreground">All currencies (INR, USD, etc.) — most recent first</p>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/20 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">Add one above or upload an invoice.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="break-words font-medium">{t.vendorName}</p>
                  <p className="break-words text-muted-foreground">
                    {formatDate(t.date)} · {t.category}
                    {t.invoiceNumber && ` · ${t.invoiceNumber}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="text-right">
                    <p
                      className={
                        t.type === 'income'
                          ? 'font-medium text-emerald-600 dark:text-emerald-400'
                          : 'font-medium text-rose-600 dark:text-rose-400'
                      }
                    >
                      {t.type === 'income' ? '+' : '-'}
                      {formatCurrency(t.amount, t.currency)}
                    </p>
                    {t.gstAmount > 0 && (
                      <p className="text-xs text-muted-foreground">GST {formatCurrency(t.gstAmount, t.currency)}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                    disabled={isPending}
                    asChild
                    aria-label="Edit transaction"
                  >
                    <Link href={`/transactions/${t.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    disabled={isPending}
                    onClick={() => handleDelete(t.id)}
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
