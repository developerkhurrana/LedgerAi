import { getServerSession } from '@/lib/auth';
import { getTransaction } from '@/app/actions/transactions';
import { redirect } from 'next/navigation';
import { EditTransactionForm } from '@/components/dashboard/EditTransactionForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTransactionPage({ params }: PageProps) {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) redirect('/login');

  const { id } = await params;
  const transaction = await getTransaction(userId, id);
  if (!transaction) redirect('/transactions');

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Edit transaction
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update vendor, amount, GST, category, or date.
        </p>
      </div>
      <EditTransactionForm userId={userId} transaction={transaction} />
    </div>
  );
}
