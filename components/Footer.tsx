import { Facebook, Globe, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { services } from '@/config/services';
import { site } from '@/config/site';
import Logo from './Logo';
import NewsletterForm from './NewsletterForm';

const socials = [
  { label: 'Facebook', href: site.socials.facebook, icon: Facebook },
  { label: 'Instagram', href: site.socials.instagram, icon: Instagram },
  { label: 'LinkedIn', href: site.socials.linkedin, icon: Linkedin },
  { label: 'X (Twitter)', href: site.socials.twitter, icon: Twitter },
  { label: 'YouTube', href: site.socials.youtube, icon: Youtube },
];

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white">
      {children}
      <span aria-hidden className="mt-2 block h-0.5 w-8 rounded-full bg-blue-500" />
    </h3>
  );
}

export default async function Footer() {
  const qr = await QRCode.toString(site.url, { type: 'svg', margin: 1, color: { dark: '#050B1F', light: '#FFFFFF' } });
  const link = 'text-sm text-slate-300 transition-colors hover:text-blue-400';

  return (
    <footer className="bg-hex relative overflow-hidden bg-navy-950 text-slate-300">
      <div aria-hidden className="absolute -top-32 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 py-12 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-semibold text-white">Stay in the loop</h3>
            <p className="mt-1 text-sm text-slate-300">Insights, case studies and digital growth tips — straight to your inbox.</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo className="h-12 w-auto" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">{site.footerBlurb}</p>
            <ul className="mt-6 flex gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`SyntaxWeb on ${label}`}
                    className="grid size-10 place-items-center rounded-full border border-white/15 text-slate-300 transition hover:border-blue-400 hover:bg-blue-500 hover:text-white hover:shadow-[0_0_18px_rgb(59_130_246/0.6)]"
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Quick links" className="lg:col-span-2">
            <Heading>Quick Links</Heading>
            <ul className="space-y-3">
              {site.nav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={link}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services" className="lg:col-span-3">
            <Heading>Services</Heading>
            <ul className="space-y-3">
              {services.slice(0, 8).map((s) => (
                <li key={s.title}>
                  <Link href="/services" className={link}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <Heading>Contact</Heading>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Globe className="size-4 shrink-0 text-blue-400" aria-hidden />
                <a href={site.url} className={link}>
                  {site.url.replace('https://', '')}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-blue-400" aria-hidden />
                <a href={`mailto:${site.email}`} className={link}>
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-blue-400" aria-hidden />
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className={link}>
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-4 shrink-0 text-blue-400" aria-hidden />
                {site.location}
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-4">
              <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-white p-1 [&>svg]:size-full" role="img" aria-label={`QR code linking to ${site.url}`} dangerouslySetInnerHTML={{ __html: qr }} />
              <p className="text-xs leading-relaxed text-slate-300">
                Scan to visit
                <br />
                our website
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-center text-xs sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="font-medium tracking-wider text-blue-400">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
