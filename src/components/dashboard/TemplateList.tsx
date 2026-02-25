'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import { FileStack, Trash2 } from 'lucide-react';
import { deleteTemplate } from '@/app/actions/templates';
import type { TemplateItem } from '@/app/actions/templates';

interface Props {
  userId: string;
  templates: TemplateItem[];
}

export function TemplateList({ userId, templates }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: string) {
    if (!confirm('Delete this template?')) return;
    const result = await deleteTemplate(userId, id);
    if (result.success) startTransition(() => router.refresh());
    else alert(result.error ?? 'Failed to delete.');
  }

  if (templates.length === 0) return null;

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileStack className="h-5 w-5 text-primary" />
          Add from template
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Use a saved template to pre-fill the form below.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
            >
              <span className="font-medium">{t.name}</span>
              <span className="text-muted-foreground">
                {t.vendorName} · {formatCurrency(t.amount, t.currency)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 shrink-0 px-2 text-primary hover:text-primary"
                asChild
              >
                <Link href={`/add?template=${t.id}`}>Use</Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                disabled={isPending}
                onClick={() => handleDelete(t.id)}
                aria-label="Delete template"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
