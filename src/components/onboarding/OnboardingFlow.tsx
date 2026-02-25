'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calculator, Receipt, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { completeOnboarding } from '@/app/actions/onboarding';

export function OnboardingFlow({
  userEmail,
  userName,
}: {
  userEmail?: string;
  userName?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(userName ?? '');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGetStarted(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await completeOnboarding({
        name: name.trim() || undefined,
        businessName: businessName.trim() || undefined,
      });
      if (!result.success) {
        setError(result.error ?? 'Something went wrong.');
        setLoading(false);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong.');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome block */}
      <div className="text-center space-y-3">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Calculator className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Welcome to LedgerAI
        </h1>
        <p className="mx-auto max-w-sm text-muted-foreground">
          Track expenses, manage GST, and get AI-powered insights—all in one place.
        </p>
      </div>

      {/* What you can do */}
      <Card className="border-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            What you can do
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex gap-3 text-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Receipt className="h-4 w-4" />
            </span>
            <div>
              <p className="font-medium text-foreground">Transactions & GST</p>
              <p className="text-muted-foreground">Add income and expenses, attach invoices, and see GST at a glance.</p>
            </div>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Lightbulb className="h-4 w-4" />
            </span>
            <div>
              <p className="font-medium text-foreground">AI insights</p>
              <p className="text-muted-foreground">Monthly summaries and suggestions based on your data.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optional profile */}
      <Card className="border-border bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick setup (optional)</CardTitle>
          <CardDescription>
            Add your name and business name now, or skip and do it later in Profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleGetStarted} className="space-y-4">
            {userEmail && (
              <p className="text-xs text-muted-foreground">
                Signed in as <span className="font-medium text-foreground">{userEmail}</span>
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="onboarding-name">Your name</Label>
              <Input
                id="onboarding-name"
                type="text"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="onboarding-business">Business name</Label>
              <Input
                id="onboarding-business"
                type="text"
                placeholder="e.g. My Store"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                autoComplete="organization"
                className="bg-background"
              />
            </div>
            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? 'Setting up…' : 'Get started'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
