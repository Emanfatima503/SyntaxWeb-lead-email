'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Lightbulb, ShieldCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { services } from '@/config/services';
import { Eyebrow, Spotlight, Typewriter } from './ui';

const chips = [
  { label: 'Innovative Solutions', icon: Lightbulb },
  { label: 'Scalable & Secure', icon: ShieldCheck },
  { label: 'Modern Technology', icon: Cpu },
  { label: 'Results Driven', icon: TrendingUp },
];

const typed = ['websites', 'mobile apps', 'online stores', 'custom software', 'AI automations', 'dashboards'] as const;

const ease = [0.22, 1, 0.36, 1] as const;

/** One headline line sliding up from behind a mask. */
function Line({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    // clip-path (not overflow-hidden) so the text glow isn't boxed in once the line has landed
    <motion.span
      className="block pb-1"
      initial={{ y: '60%', opacity: 0, clipPath: 'inset(0% -20% 100% -20%)' }}
      animate={{ y: '0%', opacity: 1, clipPath: 'inset(-60% -20% -60% -20%)' }}
      transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease }}
    >
      {children}
    </motion.span>
  );
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-navy-950 pt-32 lg:pt-40">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div aria-hidden className="absolute -left-40 top-10 size-[28rem] animate-drift rounded-full bg-blue-600/25 blur-[120px]" />
      <div aria-hidden className="absolute -right-20 bottom-0 size-[32rem] animate-drift rounded-full bg-blue-500/20 blur-[140px] [animation-delay:-7s]" />
      <Spotlight />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-24">
        <div>
          <motion.p {...fadeUp(0)} className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-mono text-xs text-slate-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            // available for new projects
          </motion.p>
          <motion.div {...fadeUp(0.1)} className="mt-6">
            <Eyebrow className="!justify-start text-blue-400">Software House</Eyebrow>
          </motion.div>
          <h1 className="mt-4 text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl xl:text-6xl">
            <Line i={0}>We build</Line>
            <Line i={1}>
              <span className="text-glow text-blue-500">solutions.</span>
            </Line>
            <Line i={2}>We grow</Line>
            <Line i={3}>
              <span className="text-glow relative inline-block text-blue-500">
                businesses.
                <motion.span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full bg-gradient-to-r from-blue-400 to-transparent shadow-[0_0_14px_rgb(59_130_246/0.9)]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 1, ease }}
                />
              </span>
            </Line>
          </h1>
          <motion.p {...fadeUp(0.75)} className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            SyntaxWeb is a Software House that delivers powerful digital solutions to help your brand establish, grow and lead in the digital world.
          </motion.p>
          <motion.p {...fadeUp(0.85)} className="mt-4 font-mono text-sm text-slate-400 sm:text-base">
            <span className="text-blue-400">&gt;</span> we build <span className="text-white">
              <Typewriter words={typed} />
            </span>
          </motion.p>
          <motion.div {...fadeUp(0.95)} className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Let&apos;s Build Your Digital Success <ArrowRight className="size-5" aria-hidden />
            </Link>
            <Link href="/services" className="btn-outline">
              View Services
            </Link>
          </motion.div>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {chips.map(({ label, icon: Icon }, i) => (
              <motion.li
                key={label}
                {...fadeUp(1.05 + i * 0.08)}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-navy-900/70 px-3 py-2.5 text-xs font-medium text-slate-200 transition-colors hover:border-blue-400/50 sm:text-[0.8rem]"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-500/15 text-blue-400">
                  <Icon className="size-4" aria-hidden />
                </span>
                {label}
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease }}>
          <DeviceStage />
        </motion.div>
      </div>

      <Marquee />
    </section>
  );
}

function Marquee() {
  const items = services.map((s) => s.title);
  return (
    <div className="relative border-y border-white/10 bg-navy-900/50 py-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <p className="sr-only">Our services: {items.join(', ')}</p>
      <div aria-hidden className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {items.map((t) => (
              <li key={t} className="flex items-center gap-6 px-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300 sm:text-base">
                {t}
                <span className="text-blue-500">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/* ---------- CSS device mockups ---------- */

function Screen({ tagline, size }: { tagline: string; size: number }) {
  // size is in cqw of the stage, so every device scales together.
  return (
    <div
      className="flex h-full flex-col overflow-hidden bg-navy-950 bg-[radial-gradient(circle_at_80%_90%,rgb(37_99_235/0.45),transparent_60%)] p-[0.7em] text-white"
      style={{ fontSize: `${size}cqw` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[0.6em] font-bold">
          &lt;/&gt; Syntax<span className="text-blue-400">Web</span>
        </span>
        <span className="flex gap-[0.3em]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[0.18em] w-[1em] rounded-full bg-white/25" />
          ))}
        </span>
      </div>
      <p className="mt-auto max-w-[85%] font-bold uppercase leading-[1.15]">{tagline}</p>
      <span className="mt-[0.5em] h-[0.9em] w-[4em] rounded-full bg-blue-500 shadow-[0_0_1em_rgb(59_130_246/0.8)]" />
      <div className="mt-auto grid grid-cols-3 gap-[0.35em] pt-[0.6em]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-[1.4em] rounded-[0.2em] border border-white/10 bg-white/5" />
        ))}
      </div>
    </div>
  );
}

function DeviceStage() {
  return (
    <div
      role="img"
      aria-label="SyntaxWeb digital products displayed on a desktop monitor, laptop, tablet and phone"
      className="relative mx-auto aspect-[5/4] w-full max-w-xl [container-type:inline-size]"
    >
      <div aria-hidden className="absolute inset-x-[8%] bottom-[2%] h-[14%] rounded-[50%] bg-blue-500/50 blur-3xl" />
      <div aria-hidden className="absolute inset-x-[4%] bottom-[6%] h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

      <div aria-hidden>
        {/* Desktop */}
        <div className="absolute left-[14%] top-[2%] w-[72%] animate-float">
          <div className="aspect-[16/10] rounded-[1.4cqw] border-[1cqw] border-slate-800 bg-slate-800 shadow-2xl shadow-blue-900/40">
            <div className="h-full overflow-hidden rounded-[0.6cqw]">
              <Screen tagline="Building Digital Products That Drive Results" size={3.4} />
            </div>
          </div>
          <div className="mx-auto h-[7cqw] w-[10%] bg-gradient-to-b from-slate-700 to-slate-800" />
          <div className="mx-auto h-[1.2cqw] w-[32%] rounded-t-[1cqw] bg-slate-700" />
        </div>

        {/* Laptop */}
        <div className="absolute bottom-[7%] left-0 w-[50%] animate-float [animation-delay:-1.5s]">
          <div className="mx-[7%] aspect-[16/10] rounded-t-[1.2cqw] border-[0.8cqw] border-b-0 border-slate-900 bg-slate-900">
            <div className="h-full overflow-hidden rounded-[0.4cqw]">
              <Screen tagline="Innovate. Develop. Deliver." size={2.6} />
            </div>
          </div>
          <div className="h-[1.6cqw] rounded-b-[1.4cqw] bg-gradient-to-b from-slate-500 to-slate-700" />
        </div>

        {/* Tablet */}
        <div className="absolute bottom-[7%] right-[9%] w-[25%] animate-float [animation-delay:-3s]">
          <div className="aspect-[3/4] rounded-[1.8cqw] border-[0.9cqw] border-slate-900 bg-slate-900 shadow-xl">
            <div className="h-full overflow-hidden rounded-[0.8cqw]">
              <Screen tagline="Smart Design. Seamless Experience. Stronger Brands." size={1.7} />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="absolute bottom-[7%] right-0 w-[12%] animate-float [animation-delay:-4.5s]">
          <div className="aspect-[9/19] rounded-[1.8cqw] border-[0.7cqw] border-slate-900 bg-slate-900 shadow-xl">
            <div className="h-full overflow-hidden rounded-[1.1cqw]">
              <Screen tagline="Innovate. Develop. Deliver." size={1.15} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
