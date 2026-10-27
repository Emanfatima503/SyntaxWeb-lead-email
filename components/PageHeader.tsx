import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Eyebrow, Reveal, Spotlight } from './ui';

/** Dark banner at the top of every inner page: breadcrumb, eyebrow, h1, intro. */
export default function PageHeader({ crumb, eyebrow, title, sub }: { crumb: string; eyebrow: string; title: string; sub: string }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-16 pt-36 lg:pb-24 lg:pt-44">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div aria-hidden className="absolute -left-32 -top-10 size-[26rem] animate-drift rounded-full bg-blue-600/25 blur-[120px]" />
      <div aria-hidden className="absolute -right-24 bottom-0 size-[24rem] animate-drift rounded-full bg-blue-500/20 blur-[120px] [animation-delay:-7s]" />
      <Spotlight />

      <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center justify-center gap-1.5 text-sm text-slate-400">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-4" />
            </li>
            <li aria-current="page" className="text-blue-400">
              {crumb}
            </li>
          </ol>
        </nav>
        <Eyebrow className="mt-6 text-blue-400">{eyebrow}</Eyebrow>
        <h1 className="mt-4 text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-5xl">{title}</h1>
        <span aria-hidden className="mx-auto mt-5 block h-1 w-16 rounded-full bg-blue-500 shadow-[0_0_16px_rgb(59_130_246/0.8)]" />
        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">{sub}</p>
      </Reveal>
    </section>
  );
}
