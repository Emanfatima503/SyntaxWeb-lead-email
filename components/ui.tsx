'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/** Soft glow that follows the mouse inside its parent (parent must be `relative`). */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 120, damping: 20 });
  const y = useSpring(0, { stiffness: 120, damping: 20 });
  const [on, setOn] = useState(false);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = parent.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
      setOn(true);
    };
    const leave = () => setOn(false);
    parent.addEventListener('pointermove', move);
    parent.addEventListener('pointerleave', leave);
    return () => {
      parent.removeEventListener('pointermove', move);
      parent.removeEventListener('pointerleave', leave);
    };
  }, [x, y]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={{ x, y }}
        className={`absolute -left-[250px] -top-[250px] size-[500px] rounded-full bg-blue-500/20 blur-3xl transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

/** Grows from slightly smaller to full size as it scrolls into view. */
export function ScrollScale({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.55'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

/** Types and deletes each word in turn, with a blinking caret. */
export function Typewriter({ words }: { words: readonly string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const word = words[i % words.length];
    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), 1600);
      return () => clearTimeout(t);
    }
    if (deleting && text === '') {
      setDeleting(false);
      setI((n) => n + 1);
      return;
    }
    const t = setTimeout(() => setText(word.slice(0, text.length + (deleting ? -1 : 1))), deleting ? 40 : 85);
    return () => clearTimeout(t);
  }, [text, deleting, i, words, reduce]);

  return (
    <>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden>
        {reduce ? words[0] : text}
        <span className="animate-caret">_</span>
      </span>
    </>
  );
}

export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] sm:text-sm ${className}`}>
      <span aria-hidden className="h-px w-8 bg-current opacity-60 sm:w-10" />
      {children}
      <span aria-hidden className="h-px w-8 bg-current opacity-60 sm:w-10" />
    </p>
  );
}

export function SectionHeading({ eyebrow, title, sub, dark = false }: { eyebrow: string; title: string; sub: string; dark?: boolean }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <Eyebrow className={dark ? 'text-blue-400' : 'text-blue-600'}>{eyebrow}</Eyebrow>
      <h2 className={`mt-4 text-3xl font-bold leading-tight sm:text-4xl ${dark ? 'text-white' : 'text-navy-950'}`}>{title}</h2>
      <span aria-hidden className="mx-auto mt-4 block h-1 w-16 rounded-full bg-blue-500 shadow-[0_0_16px_rgb(59_130_246/0.8)]" />
      <p className={`mt-5 text-base sm:text-lg ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{sub}</p>
    </Reveal>
  );
}

export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
