'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Receipt, Lightbulb, User } from 'lucide-react';
import { AddDockButton } from './AddDockButton';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/transactions', icon: Receipt, label: 'Transactions' },
  { href: '/insights', icon: Lightbulb, label: 'Insights' },
  { href: '/profile', icon: User, label: 'Profile' },
] as const;

export function AppDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-6 left-0 right-0 z-50 px-4 pb-[env(safe-area-inset-bottom)] sm:px-6"
      aria-label="Main navigation"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="relative mx-auto flex max-w-4xl items-center justify-between rounded-[32px] border border-white/20 bg-white/10 px-6 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:px-10"
      >
        {/* Glass shine layer */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/30 to-transparent opacity-20 dark:from-white/20"
          aria-hidden
        />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
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
                <Icon
                  size={26}
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive ? 'text-primary drop-shadow-lg dark:text-primary' : 'text-foreground/70'
                  }`}
                />
              </motion.span>
            </Link>
          );
        })}

        <div className="relative flex items-center justify-center">
          <AddDockButton />
        </div>
      </motion.div>
    </nav>
  );
}
