import { listTransactions } from '@/app/actions/transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/format';
import { ListOrdered } from 'lucide-react';

interface Props {
  userId: string;
}

export async function TransactionList({ userId }: Props) {
  const transactions = await listTransactions({ userId, limit: 50 });

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListOrdered className="h-5 w-5 text-primary" />
          Recent transactions
        </CardTitle>
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
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/80 bg-card px-3 py-2.5 text-sm transition-colors hover:bg-muted/30"
              >
                <div className="min-w-0 flex-1">
                  <p className="break-words font-medium">{t.vendorName}</p>
                  <p className="break-words text-muted-foreground">
                    {formatDate(t.date)} · {t.category}
                    {t.invoiceNumber && ` · ${t.invoiceNumber}`}
                  </p>
                </div>
                <div className="shrink-0 text-right">
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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
