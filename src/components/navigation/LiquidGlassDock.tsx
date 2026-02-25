'use client';

/**
 * Shared wrapper for the dock so positioning is identical on dashboard and profile.
 * Reference: rounded-full border p-1 bg-background/60 backdrop-blur, active: bg-black text-white dark:bg-white dark:text-black
 */
export function LiquidGlassDock({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto mb-2 max-w-lg px-4">
        <div className="pointer-events-auto flex w-full items-center gap-2 rounded-full border border-border p-1 bg-background/60 supports-[backdrop-filter]:bg-background/40 backdrop-blur">
          {children}
        </div>
      </div>
    </div>
  );
}
