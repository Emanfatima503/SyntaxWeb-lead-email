'use client';

import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { site } from '@/config/site';
import Logo from './Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const progress = useSpring(useScroll().scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/10 bg-navy-950/95 shadow-lg shadow-black/20 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="SyntaxWeb home">
          <Logo className="h-10 w-auto sm:h-11" />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {site.nav.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative text-sm font-medium transition-colors hover:text-white after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-blue-400 after:transition-all hover:after:w-full ${
                    active ? 'text-white after:w-full' : 'text-slate-200 after:w-0'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Link href="/contact" className="btn-primary hidden !px-5 !py-2.5 text-sm sm:inline-flex">
            Get Started
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-white lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-7" />
          </button>
        </div>
      </nav>

      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-blue-600 via-blue-400 to-sky-300 shadow-[0_0_10px_rgb(59_130_246/0.8)]"
      />

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="panel"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="bg-hex fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-sm flex-col bg-navy-950 px-6 pb-8 lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="flex h-20 items-center justify-between">
                <Logo className="h-10 w-auto" />
                <button type="button" className="rounded-lg p-2 text-white" aria-label="Close menu" onClick={() => setOpen(false)} autoFocus>
                  <X className="size-7" />
                </button>
              </div>
              <ul className="mt-6 flex flex-col gap-1">
                {site.nav.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={pathname === l.href ? 'page' : undefined}
                      className={`block rounded-xl px-4 py-3 text-lg font-medium hover:bg-white/5 hover:text-blue-400 ${
                        pathname === l.href ? 'bg-white/5 text-blue-400' : 'text-slate-100'
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary mt-auto">
                Get Started
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
