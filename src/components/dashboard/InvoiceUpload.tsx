'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { processInvoiceUpload } from '@/app/actions/upload-invoice';
import { formatCurrency } from '@/lib/format';

interface Props {
  userId: string;
  /** When true, opens the file picker on mount (e.g. from dock "Upload" → /add?upload=1). */
  autoOpenFileDialog?: boolean;
}

export function InvoiceUpload({ userId, autoOpenFileDialog }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const uploadingRef = useRef(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const autoOpenedRef = useRef(false);

  useEffect(() => {
    if (!autoOpenFileDialog || autoOpenedRef.current) return;
    autoOpenedRef.current = true;
    const t = setTimeout(() => {
      inputRef.current?.click();
      // Clean URL so refresh doesn't reopen the dialog
      const url = new URL(window.location.href);
      url.searchParams.delete('upload');
      const clean = url.pathname + (url.search || '');
      window.history.replaceState(null, '', clean);
    }, 100);
    return () => clearTimeout(t);
  }, [autoOpenFileDialog]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || uploadingRef.current) return;
    setError('');
    setSuccess('');
    uploadingRef.current = true;
    try {
      const formData = new FormData();
      formData.set('file', file);
      const result = await processInvoiceUpload(userId, formData);
      if (result.success) {
        startTransition(() => {
          router.push('/transactions');
          router.refresh();
        });
      } else {
        setError(result.error ?? 'Upload failed.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      uploadingRef.current = false;
      e.target.value = '';
    }
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-5 w-5 text-primary" />
          Upload invoice
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          PDF only. We extract details and save as an expense.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={onFile}
          disabled={isPending}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-6 transition-colors hover:border-primary/40 hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {isPending ? 'Processing…' : 'Choose PDF or drop here'}
          </span>
        </button>
        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
        {success && (
          <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
            {success}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
