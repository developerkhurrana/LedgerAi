import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function InsightsLoading() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-56 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="flex h-9 w-[180px] animate-pulse items-center gap-2 rounded-md bg-muted" />
      </div>

      <Card className="sticky top-20 border-border bg-card shadow-none lg:top-24">
        <CardHeader className="border-b border-border/60 bg-muted/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
            <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
