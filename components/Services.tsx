'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { categories, services } from '@/config/services';
import ServiceCard from './ServiceCard';
import { SectionHeading } from './ui';

/** `limit` = homepage preview (no filters, "View all" link); otherwise the full filterable grid. */
export default function Services({ limit, heading = true }: { limit?: number; heading?: boolean }) {
  const [active, setActive] = useState<(typeof categories)[number]>('All');
  const filtered = active === 'All' ? services : services.filter((s) => s.category === active);
  const shown = limit ? services.slice(0, limit) : filtered;

  return (
    <section id="services" className="bg-surface px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {heading && (
          <SectionHeading
            eyebrow="Our Digital Services"
            title="Complete Digital Solutions Under One Roof"
            sub="We offer end-to-end digital services to help your business start, grow and scale in today's competitive market."
          />
        )}

        {!limit && <div role="group" aria-label="Filter services by category" className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={active === c}
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active === c
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>}

        <motion.ul layout className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((s, i) => (
              <motion.li
                key={s.title}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              >
                <ServiceCard service={s} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {limit && (
          <div className="mt-12 text-center">
            <Link href="/services" className="btn-primary">
              View All {services.length} Services <ArrowRight className="size-5" aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
