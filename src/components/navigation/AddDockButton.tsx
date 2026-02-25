'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AddDockButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isActive = pathname === '/add';

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function goTo(path: string) {
    setOpen(false);
    router.push(path);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Add transaction"
        aria-expanded={open}
        aria-haspopup="true"
        className="relative flex items-center justify-center"
      >
        <motion.span
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.15 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="relative flex items-center justify-center"
        >
          {isActive && (
            <motion.span
              layoutId="active-pill"
              className="absolute -inset-3 rounded-full bg-primary/30 blur-xl"
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          )}
          <Plus
            size={26}
            className={`relative z-10 transition-colors duration-300 ${
              isActive ? 'text-primary drop-shadow-lg dark:text-primary' : 'text-primary'
            }`}
          />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute bottom-full right-0 mb-2 flex flex-col gap-1 rounded-2xl border border-white/20 bg-card/95 px-1 py-1.5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-card/95 sm:right-1/2 sm:translate-x-1/2"
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 rounded-xl px-4 py-2.5 text-foreground"
              onClick={() => goTo('/add')}
            >
              <Pencil className="h-4 w-4 shrink-0 text-primary" />
              Manually
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 rounded-xl px-4 py-2.5 text-foreground"
              onClick={() => goTo('/add?upload=1')}
            >
              <Upload className="h-4 w-4 shrink-0 text-primary" />
              Upload
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
