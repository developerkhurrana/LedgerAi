import { getServerSession } from '@/lib/auth';
import { listTransactions } from '@/app/actions/transactions';
import { TransactionListView } from '@/components/dashboard/TransactionListView';
import { MonthPicker } from '@/components/dashboard/MonthPicker';
import { startOfMonth, endOfMonth } from 'date-fns';

interface PageProps {
  searchParams: Promise<{ year?: string; month?: string }>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) return null;

  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year, 10) : now.getFullYear();
  const month = params.month ? parseInt(params.month, 10) : now.getMonth();
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(start);

  const transactions = await listTransactions({
    userId,
    from: start.toISOString(),
    to: end.toISOString(),
    limit: 100,
  });

  const items = transactions.map((t) => ({
    id: t.id,
    type: t.type,
    vendorName: t.vendorName,
    amount: t.amount,
    currency: t.currency ?? 'INR',
    gstAmount: t.gstAmount ?? 0,
    category: t.category,
    invoiceNumber: t.invoiceNumber ?? null,
    date: t.date,
  }));

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Transactions
          </h1>
          <p className="text-sm text-muted-foreground">View and manage transactions for the selected month</p>
        </div>
        <MonthPicker currentYear={year} currentMonth={month} basePath="/transactions" />
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Recent transactions
        </h2>
        <TransactionListView userId={userId} transactions={items} />
      </section>
    </div>
  );
}
