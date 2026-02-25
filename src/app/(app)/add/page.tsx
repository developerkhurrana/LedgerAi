import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AddTransactionForm } from '@/components/dashboard/AddTransactionForm';
import { InvoiceUpload } from '@/components/dashboard/InvoiceUpload';

interface PageProps {
  searchParams: Promise<{ upload?: string }>;
}

export default async function AddPage({ searchParams }: PageProps) {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) redirect('/login');

  const params = await searchParams;
  const autoOpenUpload = params.upload === '1';

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Add transaction
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter details manually or upload an invoice (PDF).
        </p>
      </div>

      <div className="space-y-6">
        <AddTransactionForm userId={userId} />
        <InvoiceUpload userId={userId} autoOpenFileDialog={autoOpenUpload} />
      </div>
    </div>
  );
}
