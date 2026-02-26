'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles } from 'lucide-react';
import { chatWithExpert, type ChatMessage } from '@/app/actions/chat';

export function ChatExpert() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setError('');
    setInput('');
    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const result = await chatWithExpert([...messages, userMessage]);
      if (result.success && result.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: result.reply! }]);
      } else {
        setError(result.error ?? 'Could not get a reply.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border border-border bg-card/50 sm:h-[calc(100vh-9rem)]">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-center gap-2 border-b border-border px-3 py-3 sm:px-4">
        <Sparkles className="h-5 w-5 shrink-0 text-primary" />
        <span className="font-semibold text-foreground">AI Expert</span>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                How can I help you today?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask about LedgerAI, GST, expenses, or your finances.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm sm:max-w-[75%] ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                  <span className="animate-pulse">Thinking…</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border p-3 sm:p-4">
        {error && (
          <p className="mb-2 rounded-md bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Ask about LedgerAI, GST, or your finances…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="min-h-11 flex-1 rounded-xl border-border bg-background text-foreground placeholder:text-foreground/60"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl"
            disabled={loading || !input.trim()}
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
