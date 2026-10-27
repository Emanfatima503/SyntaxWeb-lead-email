'use client';

import { MotionConfig } from 'framer-motion';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { captureAttribution } from '@/lib/client';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(captureAttribution, []);
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <Toaster position="top-center" richColors closeButton />
    </MotionConfig>
  );
}
