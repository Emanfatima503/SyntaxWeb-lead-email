'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { Clock, Lightbulb, ShieldCheck, Smile, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { site } from '@/config/site';
import { Reveal, SectionHeading, Spotlight } from './ui';

const reasons = [
  { title: 'Innovative Solutions', icon: Lightbulb, text: 'We use the latest technologies to build future-ready solutions.' },
  { title: 'Experienced Team', icon: Users, text: 'Skilled professionals with years of industry experience.' },
  { title: 'Quality & Reliability', icon: ShieldCheck, text: 'Secure, reliable and high-quality solutions.' },
  { title: 'On-Time Delivery', icon: Clock, text: 'We value time and always deliver on schedule.' },
  { title: 'Client Satisfaction', icon: Smile, text: 'Your satisfaction is our top priority, always.' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = `${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => ref.current && (ref.current.textContent = `${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix]);

  return (
    <span ref={ref}>
      0{suffix}
    </span>
  );
}

/** Animated counters from site.stats — for dark backgrounds. */
export function Stats() {
  return (
    <dl className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
      {site.stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
          <dt className="mt-2 text-sm font-medium uppercase tracking-wider text-blue-400">{s.label}</dt>
          <dd className="text-glow text-4xl font-extrabold text-white sm:text-5xl">
            <Counter value={s.value} suffix={s.suffix} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function WhyUs({ heading = true }: { heading?: boolean }) {
  return (
    <section id="why-us" className="bg-hex relative overflow-hidden bg-navy-950 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Spotlight />
      <div aria-hidden className="absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl">
        {heading && (
          <SectionHeading
            dark
            eyebrow="Why Choose SyntaxWeb"
            title="Your Trusted Partner for Digital Growth"
            sub="Technology, talent and a commitment to results — everything your business needs to grow with confidence."
          />
        )}

        <ul className={`${heading ? 'mt-14' : ''} grid overflow-hidden rounded-2xl border border-white/10 bg-navy-900/60 sm:grid-cols-2 lg:grid-cols-5`}>
          {reasons.map(({ title, icon: Icon, text }, i) => (
            <li key={title} className="border-white/10 [&:not(:last-child)]:border-b sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:[&:not(:last-child)]:border-b-0 lg:[&:not(:last-child)]:border-r sm:last:col-span-2 lg:last:col-span-1">
              <Reveal delay={i * 0.08} className="group h-full p-7 text-center transition-colors hover:bg-blue-500/5">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-blue-400/30 bg-blue-500/10 text-blue-400 transition-shadow group-hover:shadow-[0_0_24px_rgb(59_130_246/0.5)]">
                  <Icon className="size-7" aria-hidden />
                </span>
                <h3 className="mt-5 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Stats />
      </div>
    </section>
  );
}
