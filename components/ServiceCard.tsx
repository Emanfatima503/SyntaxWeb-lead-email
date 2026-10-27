import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@/config/services';

export default function ServiceCard({ service }: { service: Service }) {
  const { title, description, image, icon: Icon } = service;
  return (
    <article
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-400/50 hover:shadow-[0_18px_40px_-12px_rgb(37_99_235/0.35)]">
      {/* Cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(260px circle at var(--x) var(--y), rgb(59 130 246 / 0.14), transparent 70%)' }}
      />
      {/* Photo header with brand tint */}
      <div className="relative h-44 overflow-hidden bg-navy-900">
        <Image
          src={image}
          alt={`${title} service`}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-blue-600/20 transition-opacity duration-500 group-hover:opacity-70" />
        <div aria-hidden className="bg-hex absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-navy-950/60 px-3 py-1 text-[0.7rem] font-medium text-white backdrop-blur">
          {service.category}
        </span>
      </div>
      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-10">
        <span className="absolute -top-7 left-6 grid size-14 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-600/30">
          <Icon className="size-6" aria-hidden />
        </span>
        <h3 className="text-lg font-semibold text-navy-950">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
        {/* Contact form preselects this service from ?service= */}
        <Link
          href={`/contact?service=${encodeURIComponent(title)}`}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-500"
          aria-label={`Learn more about ${title}`}
        >
          Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
