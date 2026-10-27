import { Rocket } from 'lucide-react';
import { ScrollScale } from './ui';

export default function VisionBanner() {
  return (
    <section id="about" aria-label="About SyntaxWeb" className="bg-surface px-4 pt-16 sm:px-6 lg:px-8 lg:pt-20">
      <ScrollScale className="bg-hex relative mx-auto flex max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-3xl bg-navy-950 p-8 text-center shadow-xl shadow-navy-950/20 sm:p-10 md:flex-row md:text-left">
        <div aria-hidden className="absolute -left-16 -top-16 size-56 rounded-full bg-blue-600/30 blur-3xl" />
        <span className="relative grid size-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-[0_0_30px_rgb(59_130_246/0.6)]">
          <Rocket className="size-8" aria-hidden />
        </span>
        <h2 className="relative text-xl font-bold leading-snug text-white sm:text-2xl md:max-w-sm">
          Your Vision. <span className="text-blue-400">Our Technology.</span> Limitless Possibilities.
        </h2>
        <span aria-hidden className="relative hidden h-16 w-px bg-white/15 md:block" />
        <p className="relative text-slate-300 md:flex-1">
          We combine creativity, technology and strategy to deliver digital solutions that drive real business growth.
        </p>
      </ScrollScale>
    </section>
  );
}
