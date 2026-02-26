'use server';

import OpenAI from 'openai';
import { getServerSession } from '@/lib/auth';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are the AI expert for LedgerAI, an expense, GST, and cash flow app for Indian small businesses. You help users with:

- How to use LedgerAI: adding transactions, uploading invoices, viewing dashboard, overview & GST, insights, templates, and profile.
- Understanding their finances: income vs expenses, net profit, input GST, output GST, net GST payable.
- Best practices: categorizing transactions, GST compliance in India, recurring entries (rent, subscriptions), and interpreting AI insights.
- Troubleshooting: where to find features, what a metric means, how to edit or delete a transaction.

Keep replies concise, friendly, and practical. If you don't know something about LedgerAI, say so. Do not make up feature names or steps. When relevant, suggest using specific parts of the app (e.g. "Check your Overview & GST page" or "Add that as a template from the Add screen").`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResult {
  success: boolean;
  reply?: string;
  error?: string;
}

/**
 * Send user message and get AI expert reply. Uses conversation history for context.
 */
export async function chatWithExpert(messages: ChatMessage[]): Promise<ChatResult> {
  const session = await getServerSession();
  if (!session?.user?.id) return { success: false, error: 'Please sign in to chat.' };
  if (!openai) {
    return {
      success: false,
      error: 'AI expert is not available. Add OPENAI_API_KEY to enable it.',
    };
  }
  if (!messages.length) return { success: false, error: 'No messages to send.' };

  try {
    const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: apiMessages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) return { success: false, error: 'No reply from the expert.' };
    return { success: true, reply };
  } catch (e) {
    console.error('Chat expert error:', e);
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}
