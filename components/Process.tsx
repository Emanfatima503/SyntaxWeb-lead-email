'use client';

import { motion } from 'framer-motion';
import { ChevronRight, ClipboardList, Code2, Headphones, PenTool, Rocket, Search, Target } from 'lucide-react';
import { Reveal, SectionHeading } from './ui';

const steps = [
  { title: 'Discover', icon: Search, text: 'We understand your business, goals and requirements.' },
  { title: 'Plan', icon: ClipboardList, text: 'We analyze, strategize and create a roadmap for success.' },
  { title: 'Design', icon: PenTool, text: 'We design intuitive interfaces and smooth user experiences.' },
  { title: 'Develop', icon: Code2, text: 'We build high-quality, secure and scalable solutions.' },
  { title: 'Deploy', icon: Rocket, text: 'We test thoroughly and launch your project successfully.' },
  { title: 'Support', icon: Headphones, text: 'We provide ongoing support and help your business grow.' },
];

export default function Process({ heading = true }: { heading?: boolean }) {
  return (
    <section id="process" className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {heading && <SectionHeading eyebrow="Our Process" title="Our Proven Process for Success" sub="A clear and transparent process to deliver exceptional results." />}

        <ol className="mx-auto mt-16 grid max-w-xl gap-8 lg:max-w-none lg:grid-cols-6 lg:gap-4">
          {steps.map(({ title, icon: Icon, text }, i) => (
            <li key={title} className="relative">
              <Reveal delay={i * 0.08} className="flex gap-5 lg:flex-col lg:items-center lg:text-center">
                <span className="relative grid size-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-[0_10px_30px_-8px_rgb(37_99_235/0.7)] ring-8 ring-blue-500/10 transition-transform duration-300 hover:-translate-y-1 hover:rotate-6">
                  <Icon className="size-7" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold tracking-widest text-blue-600 lg:mt-5">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 text-lg font-semibold text-navy-950">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
                </div>
              </Reveal>
              {i < steps.length - 1 && (
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0, scaleY: 0 }}
                  whileInView={{ scaleX: 1, scaleY: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
                  className="absolute -bottom-6 left-8 top-[4.5rem] w-0 origin-top-left border-l-2 border-dashed border-blue-400/60 lg:bottom-auto lg:left-[calc(50%+2.75rem)] lg:right-[calc(1.75rem-50%)] lg:top-8 lg:w-auto lg:border-l-0 lg:border-t-2"
                >
                  <ChevronRight className="absolute -bottom-2 -left-[9px] size-4 rotate-90 text-blue-500 lg:-right-2 lg:-top-[9px] lg:bottom-auto lg:left-auto lg:rotate-0" />
                </motion.span>
              )}
            </li>
          ))}
        </ol>

        <Reveal className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-blue-500/20 bg-surface p-6 text-center shadow-sm sm:flex-row sm:text-left">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blue-600/10 text-blue-600">
            <Target className="size-6" aria-hidden />
          </span>
          <p className="text-base font-medium text-navy-950 sm:text-lg">
            We don&apos;t just build websites or apps, we build <span className="text-blue-600">long-term digital partnerships.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
