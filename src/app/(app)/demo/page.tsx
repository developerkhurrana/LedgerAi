import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LiquidButton, MetalButton } from '@/components/ui/liquid-glass-button';
import { ArrowLeft } from 'lucide-react';

export default async function DemoPage() {
  const session = await getServerSession();
  if (!session?.user) redirect('/login');

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Liquid glass & metal buttons
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          UI components from <code className="rounded bg-muted px-1">components/ui/liquid-glass-button.tsx</code>
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          LiquidButton
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <LiquidButton>Liquid glass</LiquidButton>
          <LiquidButton size="lg">Large</LiquidButton>
          <LiquidButton size="sm">Small</LiquidButton>
          <LiquidButton variant="outline">Outline</LiquidButton>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          MetalButton
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <MetalButton variant="default">Default</MetalButton>
          <MetalButton variant="primary">Primary</MetalButton>
          <MetalButton variant="success">Success</MetalButton>
          <MetalButton variant="error">Error</MetalButton>
          <MetalButton variant="gold">Gold</MetalButton>
          <MetalButton variant="bronze">Bronze</MetalButton>
        </div>
      </section>
    </div>
  );
}
