import Link from 'next/link';
import { getServerSession } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User, ChevronRight } from 'lucide-react';

export default async function SettingsPage() {
  const session = await getServerSession();
  if (!session?.user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Account and app preferences.</p>
      </div>

      <Card className="border-border bg-card shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Link
            href="/profile"
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <span className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              Business profile
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <a
            href="/api/auth/signout"
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <span className="flex items-center gap-3">
              <LogOut className="h-4 w-4 text-muted-foreground" />
              Sign out
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
