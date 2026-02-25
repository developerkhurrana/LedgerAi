import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface Insight {
  title: string;
  description: string;
  type: string;
  value?: string;
}

interface Props {
  insights: Insight[];
}

export function InsightsPanel({ insights }: Props) {
  return (
    <Card className="sticky top-20 border-border bg-card shadow-none lg:top-24">
      <CardHeader className="border-b border-border/60 bg-muted/20 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </span>
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {insights.length === 0 ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/20 px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">No insights for this period.</p>
            <p className="mt-1 text-xs text-muted-foreground">Add OPENAI_API_KEY for AI summaries.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {insights.map((insight, i) => (
              <li key={i} className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                <p className="break-words font-medium">{insight.title}</p>
                {insight.value && (
                  <p className="mt-0.5 break-words text-primary font-medium">{insight.value}</p>
                )}
                <p className="mt-1 break-words text-muted-foreground">{insight.description}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
