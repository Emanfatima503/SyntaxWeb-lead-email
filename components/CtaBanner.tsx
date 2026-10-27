import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ScrollScale } from './ui';

export default function CtaBanner() {
  return (
    <section aria-label="Get in touch" className="bg-surface px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <ScrollScale className="bg-hex relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-navy-950 px-6 py-14 text-center shadow-2xl shadow-navy-950/30 sm:px-12">
        <div aria-hidden className="absolute -bottom-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-blue-500/40 blur-[90px]" />
        <h2 className="relative text-3xl font-bold text-white sm:text-4xl">
          Let&apos;s Build Something <span className="text-glow text-blue-400">Amazing</span> Together
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-slate-300">Have a project in mind? Let&apos;s discuss how we can help you achieve your goals.</p>
        <Link href="/contact" className="btn-primary relative mt-8 uppercase tracking-wider">
          Get in touch <ArrowRight className="size-5" aria-hidden />
        </Link>
      </ScrollScale>
    </section>
  );
}
