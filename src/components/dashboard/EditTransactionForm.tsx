'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateTransaction } from '@/app/actions/transactions';
import { createTemplate } from '@/app/actions/templates';
import type { TransactionType } from '@/lib/db';
import { Pencil, FileStack } from 'lucide-react';

const editTransactionSchema = z.object({
  vendorName: z.string().min(1, 'Vendor or payee is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  gstPercent: z.number().min(0).max(100),
  category: z.string().min(1, 'Category is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date'),
});

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

const CURRENCIES = ['INR', 'USD'] as const;

export interface EditTransactionInitial {
  id: string;
  type: TransactionType;
  vendorName: string;
  amount: number;
  currency: string;
  gstPercent: number;
  category: string;
  invoiceNumber?: string;
  date: string;
}

interface Props {
  userId: string;
  transaction: EditTransactionInitial;
}

export function EditTransactionForm({ userId, transaction }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const submittingRef = useRef(false);
  const [type, setType] = useState<TransactionType>(transaction.type);
  const [vendorName, setVendorName] = useState(transaction.vendorName);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [currency, setCurrency] = useState(transaction.currency || 'INR');
  const [gstPercent, setGstPercent] = useState(String(transaction.gstPercent));
  const [category, setCategory] = useState(transaction.category);
  const [invoiceNumber, setInvoiceNumber] = useState(transaction.invoiceNumber ?? '');
  const [date, setDate] = useState(transaction.date);
  const [error, setError] = useState('');
  const [savingTemplate, setSavingTemplate] = useState(false);

  async function handleSaveAsTemplate() {
    const name = window.prompt('Template name (e.g. Monthly rent, Netflix):');
    if (!name?.trim()) return;
    setSavingTemplate(true);
    try {
      const result = await createTemplate(userId, {
        name: name.trim(),
        type,
        vendorName: vendorName.trim() || 'Unknown',
        amount: parseFloat(amount) || 0,
        currency: currency || 'INR',
        gstPercent: parseFloat(gstPercent) || 0,
        category: category.trim() || 'General',
        invoiceNumber: invoiceNumber.trim() || undefined,
      });
      if (result.success) {
        router.push(`/add?template=${result.id}`);
        router.refresh();
      } else {
        alert(result.error ?? 'Failed to save template.');
      }
    } catch {
      alert('Something went wrong.');
    } finally {
      setSavingTemplate(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    setError('');
    const parsed = editTransactionSchema.safeParse({
      vendorName: vendorName.trim() || 'Unknown',
      amount: parseFloat(amount),
      gstPercent: parseFloat(gstPercent) || 0,
      category: category.trim(),
      date,
    });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Please fix the form.');
      return;
    }
    submittingRef.current = true;
    try {
      const result = await updateTransaction(userId, transaction.id, {
        type,
        vendorName: parsed.data.vendorName,
        amount: parsed.data.amount,
        currency: currency || 'INR',
        gstPercent: parsed.data.gstPercent,
        category: parsed.data.category,
        invoiceNumber: invoiceNumber.trim() || undefined,
        date: parsed.data.date,
      });
      if (!result.success) {
        setError(result.error ?? 'Failed to update.');
        return;
      }
      startTransition(() => {
        router.push('/transactions');
        router.refresh();
      });
    } catch {
      setError('Something went wrong.');
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Pencil className="h-5 w-5 text-primary" />
          Edit transaction
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/transactions" className="text-primary hover:underline">
            ← Back to transactions
          </Link>
          <span className="text-border">·</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-primary hover:underline"
            disabled={savingTemplate}
            onClick={handleSaveAsTemplate}
          >
            <FileStack className="mr-1 inline h-3.5 w-3.5" />
            Save as template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="edit-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-vendor">Vendor / Payee</Label>
            <Input
              id="edit-vendor"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="Vendor or client name"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="edit-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-gst">GST %</Label>
              <Input
                id="edit-gst"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={gstPercent}
                onChange={(e) => setGstPercent(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-invoice">Invoice number (optional)</Label>
              <Input
                id="edit-invoice"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-001"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/transactions">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
