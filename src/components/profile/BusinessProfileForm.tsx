'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateBusinessProfile } from '@/app/actions/profile';

const profileSchema = z.object({
  businessName: z.string().max(120).optional(),
  legalName: z.string().max(160).optional(),
  gstin: z.string().max(20).optional(),
  pan: z.string().max(20).optional(),
  phone: z.string().max(20).optional(),
  addressLine1: z.string().max(200).optional(),
  addressLine2: z.string().max(200).optional(),
  city: z.string().max(80).optional(),
  state: z.string().max(80).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(80).optional(),
  baseCurrency: z.string().max(3).optional(),
  financialYearStartMonth: z.number().int().min(0).max(11),
});

export type BusinessProfileFormValues = z.infer<typeof profileSchema>;

interface Props {
  userId: string;
  initialProfile: BusinessProfileFormValues & {
    email: string;
    name: string;
  };
}

const MONTH_OPTIONS = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April (India default)' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
];

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'] as const;

export function BusinessProfileForm({ userId, initialProfile }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<BusinessProfileFormValues>({
    businessName: initialProfile.businessName,
    legalName: initialProfile.legalName,
    gstin: initialProfile.gstin,
    pan: initialProfile.pan,
    phone: initialProfile.phone,
    addressLine1: initialProfile.addressLine1,
    addressLine2: initialProfile.addressLine2,
    city: initialProfile.city,
    state: initialProfile.state,
    postalCode: initialProfile.postalCode,
    country: initialProfile.country,
    baseCurrency: initialProfile.baseCurrency,
    financialYearStartMonth: initialProfile.financialYearStartMonth,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange<K extends keyof BusinessProfileFormValues>(
    key: K,
    value: BusinessProfileFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const parsed = profileSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Please fix the form.');
      return;
    }
    const data = parsed.data;
    startTransition(async () => {
      const result = await updateBusinessProfile(userId, data);
      if (!result.success) {
        setError(result.error ?? 'Failed to update profile.');
        return;
      }
      setSuccess('Profile updated.');
      router.refresh();
    });
  }

  return (
    <Card className="border-border bg-card shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Business details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
              {success}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={initialProfile.email} disabled />
            </div>
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={initialProfile.name} disabled />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="businessName">Business name</Label>
            <Input
              id="businessName"
              value={values.businessName ?? ''}
              onChange={(e) => handleChange('businessName', e.target.value)}
              placeholder="Cursor Technologies LLP"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="legalName">Legal name (optional)</Label>
            <Input
              id="legalName"
              value={values.legalName ?? ''}
              onChange={(e) => handleChange('legalName', e.target.value)}
              placeholder="As per PAN / GST registration"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input
                id="gstin"
                value={values.gstin ?? ''}
                onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
                placeholder="22AAAAA0000A1Z5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pan">PAN</Label>
              <Input
                id="pan"
                value={values.pan ?? ''}
                onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                placeholder="AAAAA0000A"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={values.phone ?? ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address1">Address line 1</Label>
            <Input
              id="address1"
              value={values.addressLine1 ?? ''}
              onChange={(e) => handleChange('addressLine1', e.target.value)}
              placeholder="Street, building"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address2">Address line 2 (optional)</Label>
            <Input
              id="address2"
              value={values.addressLine2 ?? ''}
              onChange={(e) => handleChange('addressLine2', e.target.value)}
              placeholder="Area, landmark"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={values.city ?? ''}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={values.state ?? ''}
                onChange={(e) => handleChange('state', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postalCode">PIN / Postal code</Label>
              <Input
                id="postalCode"
                value={values.postalCode ?? ''}
                onChange={(e) => handleChange('postalCode', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={values.country ?? 'India'}
                onChange={(e) => handleChange('country', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="baseCurrency">Base currency</Label>
              <select
                id="baseCurrency"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={values.baseCurrency ?? 'INR'}
                onChange={(e) => handleChange('baseCurrency', e.target.value.toUpperCase())}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fyStart">Financial year starts in</Label>
              <select
                id="fyStart"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={values.financialYearStartMonth}
                onChange={(e) => handleChange('financialYearStartMonth', Number(e.target.value))}
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving…' : 'Save profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

