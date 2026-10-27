import type { Metadata } from 'next';
import { ArrowRight, Target } from 'lucide-react';
import Link from 'next/link';
import CtaBanner from '@/components/CtaBanner';
import PageHeader from '@/components/PageHeader';
import { Eyebrow, Reveal } from '@/components/ui';
import VisionBanner from '@/components/VisionBanner';
import { Stats } from '@/components/WhyUs';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'About',
  description: site.footerBlurb,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader crumb="About" eyebrow="About Us" title="About SyntaxWeb" sub={site.description} />
      <VisionBanner />

      <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <Eyebrow className="!justify-start text-blue-600">Who We Are</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-navy-950 sm:text-4xl">A Full-Service Software House</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{site.footerBlurb}</p>
            <p className="mt-4 leading-relaxed text-slate-600">
              We combine creativity, technology and strategy to deliver digital solutions that drive real business growth.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/services" className="btn-primary">
                Explore Services <ArrowRight className="size-5" aria-hidden />
              </Link>
              <Link href="/process" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3 font-semibold text-navy-950 transition hover:border-blue-500 hover:text-blue-600">
                Our Process
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="bg-hex relative overflow-hidden rounded-3xl bg-navy-950 p-8 shadow-xl sm:p-10">
            <div aria-hidden className="absolute -right-16 -top-16 size-56 rounded-full bg-blue-600/30 blur-3xl" />
            <span className="relative grid size-14 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-[0_0_30px_rgb(59_130_246/0.6)]">
              <Target className="size-7" aria-hidden />
            </span>
            <p className="relative mt-6 text-xl font-semibold leading-snug text-white sm:text-2xl">
              We don&apos;t just build websites or apps, we build <span className="text-blue-400">long-term digital partnerships.</span>
            </p>
            <p className="relative mt-4 font-medium tracking-wider text-blue-400">{site.tagline}</p>
          </Reveal>
        </div>
      </section>

      <section aria-label="SyntaxWeb in numbers" className="bg-hex bg-navy-950 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Stats />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
