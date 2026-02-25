'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { z } from 'zod';
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
import { createTransaction } from '@/app/actions/transactions';
import type { TransactionType } from '@/lib/db';
import { PlusCircle } from 'lucide-react';

const addTransactionSchema = z.object({
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

interface Props {
  userId: string;
}

export function AddTransactionForm({ userId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const submittingRef = useRef(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [vendorName, setVendorName] = useState('');
  const [amount, setAmount] = useState('');
  const [gstPercent, setGstPercent] = useState('0');
  const [category, setCategory] = useState('General');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    setError('');
    const parsed = addTransactionSchema.safeParse({
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
      const result = await createTransaction(userId, {
        type,
        vendorName: parsed.data.vendorName,
        amount: parsed.data.amount,
        gstPercent: parsed.data.gstPercent,
        category: parsed.data.category,
        invoiceNumber: invoiceNumber.trim() || undefined,
        date: parsed.data.date,
      });
      if (!result.success) {
        setError(result.error ?? 'Failed to save.');
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
          <PlusCircle className="h-5 w-5 text-primary" />
          Add transaction
        </CardTitle>
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
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
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
            <Label htmlFor="vendor">Vendor / Payee</Label>
            <Input
              id="vendor"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="Vendor or client name"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
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
              <Label htmlFor="gst">GST %</Label>
              <Input
                id="gst"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={gstPercent}
                onChange={(e) => setGstPercent(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="invoice">Invoice number (optional)</Label>
              <Input
                id="invoice"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
            {isPending ? 'Saving…' : 'Add transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
