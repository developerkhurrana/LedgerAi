import OpenAI from 'openai';

/** Monthly insight item from AI */
export interface MonthlyInsight {
  type: 'spending_change' | 'highest_category' | 'gst_alert' | 'general';
  title: string;
  description: string;
  value?: string;
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

/**
 * Generate short monthly summary insights from aggregated data.
 * Uses OpenAI to turn numbers into actionable bullet points.
 */
export async function generateMonthlyInsights(
  context: {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    totalInputGst: number;
    totalOutputGst: number;
    netGstPayable: number;
    topCategory?: string;
    topCategoryAmount?: number;
    previousMonthExpenses?: number;
  }
): Promise<MonthlyInsight[]> {
  if (!openai) {
    return [
      {
        type: 'general',
        title: 'Insights unavailable',
        description: 'Add OPENAI_API_KEY to enable AI-generated insights.',
      },
    ];
  }

  const prompt = `You are a concise business advisor for Indian small businesses. Based on this month's numbers, return a JSON array of 3-5 insight objects. Each object has: "type" (one of: spending_change, highest_category, gst_alert, general), "title" (short), "description" (1-2 sentences), optional "value" (e.g. percentage or amount string).

Numbers:
- Total Income: ${context.totalIncome}
- Total Expenses: ${context.totalExpenses}
- Net Profit: ${context.netProfit}
- Input GST: ${context.totalInputGst}
- Output GST: ${context.totalOutputGst}
- Net GST Payable: ${context.netGstPayable}
${context.topCategory ? `- Highest expense category: ${context.topCategory} (${context.topCategoryAmount})` : ''}
${context.previousMonthExpenses != null ? `- Previous month expenses: ${context.previousMonthExpenses}` : ''}

Include: spending increase/decrease % if comparable, highest expense category callout, and GST due alert if net GST payable > 0. Return only valid JSON array, no markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return [];

    const data = JSON.parse(content) as { insights?: unknown[] };
    const list = Array.isArray(data.insights) ? data.insights : [];
    return list.slice(0, 5).map((item: unknown) => {
      const o = item as Record<string, unknown>;
      return {
      type: (o.type as MonthlyInsight['type']) ?? 'general',
        title: String(o.title ?? ''),
        description: String(o.description ?? ''),
        value: o.value != null ? String(o.value) : undefined,
      };
    });
  } catch {
    return [];
  }
}
