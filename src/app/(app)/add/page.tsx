import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AddTransactionForm } from '@/components/dashboard/AddTransactionForm';
import { InvoiceUpload } from '@/components/dashboard/InvoiceUpload';
import { TemplateList } from '@/components/dashboard/TemplateList';
import { listTemplates, getTemplate } from '@/app/actions/templates';

interface PageProps {
  searchParams: Promise<{ upload?: string; template?: string }>;
}

export default async function AddPage({ searchParams }: PageProps) {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) redirect('/login');

  const params = await searchParams;
  const autoOpenUpload = params.upload === '1';
  const templateId = params.template?.trim() || undefined;

  const [templates, template] = await Promise.all([
    listTemplates(userId),
    templateId ? getTemplate(userId, templateId) : Promise.resolve(null),
  ]);

  const initialData = template
    ? {
        type: template.type,
        vendorName: template.vendorName,
        amount: template.amount,
        currency: template.currency,
        gstPercent: template.gstPercent,
        category: template.category,
        invoiceNumber: template.invoiceNumber,
      }
    : undefined;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Add transaction
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter details manually, use a template, or upload an invoice (PDF).
        </p>
      </div>

      <div className="space-y-6">
        <TemplateList userId={userId} templates={templates} />
        <AddTransactionForm
          key={templateId ?? 'new'}
          userId={userId}
          initialData={initialData}
        />
        <InvoiceUpload userId={userId} autoOpenFileDialog={autoOpenUpload} />
      </div>
    </div>
  );
}
