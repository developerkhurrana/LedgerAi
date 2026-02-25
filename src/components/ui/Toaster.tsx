'use client';

import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast';

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport />
      {/* Toasts are rendered via useToast hook / toast() calls */}
    </ToastProvider>
  );
}
