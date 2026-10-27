'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { services } from '@/config/services';
import { site } from '@/config/site';
import { submit } from '@/lib/client';
import { contactSchema, type ContactValues } from '@/lib/schemas';
import { Reveal, SectionHeading } from './ui';

const info = [
  { icon: Mail, label: 'Email Us', value: site.email, sub: site.secondaryEmail, href: `mailto:${site.email}` },
  { icon: Phone, label: 'Call Us', value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
  { icon: Globe, label: 'Website', value: site.url.replace('https://', ''), href: site.url },
  { icon: MapPin, label: 'Location', value: site.location },
];

const defaults: ContactValues = {
  name: '',
  email: '',
  countryCode: '+92',
  phone: '',
  company: '',
  service: '',
  budget: '',
  message: '',
  consent: false,
  website: '',
};

function Field({ id, label, required, error, children }: { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy-950">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact({ heading = true }: { heading?: boolean }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: defaults });

  // Preselect from a service card's "Learn more" link (/contact?service=…).
  useEffect(() => {
    const picked = new URLSearchParams(window.location.search).get('service');
    if (picked && services.some((s) => s.title === picked)) setValue('service', picked);
  }, [setValue]);

  const onSubmit = async (values: ContactValues) => {
    try {
      await submit('/api/contact', values);
      toast.success('Thank you! Your inquiry has been sent — we will get back to you within one business day.');
      reset(defaults);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const a11y = (name: keyof ContactValues) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  return (
    <section id="contact" className="bg-surface px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {heading && <SectionHeading eyebrow="Contact Us" title="Let's Talk About Your Project" sub="Tell us about your goals and we'll get back to you with ideas, a plan and a quote." />}

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          {/* Info + map */}
          <Reveal className="flex flex-col gap-4 lg:col-span-2">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {info.map(({ icon: Icon, label, value, sub, href }) => (
                <li key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</p>
                    {href ? (
                      <a href={href} className="block truncate font-semibold text-navy-950 hover:text-blue-600">
                        {value}
                      </a>
                    ) : (
                      <p className="font-semibold text-navy-950">{value}</p>
                    )}
                    {sub && <p className="truncate text-sm text-slate-600">{sub}</p>}
                  </div>
                </li>
              ))}
            </ul>
            {site.mapEmbedUrl ? (
              <iframe
                title="SyntaxWeb location map"
                src={site.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-56 w-full flex-1 rounded-2xl border-0"
              />
            ) : (
              <div className="bg-grid relative grid h-56 flex-1 place-items-center overflow-hidden rounded-2xl bg-navy-950 text-center">
                <div aria-hidden className="absolute size-40 rounded-full bg-blue-500/30 blur-3xl" />
                <div className="relative">
                  <MapPin className="mx-auto size-10 animate-bounce text-blue-400" aria-hidden />
                  <p className="mt-3 font-semibold text-white">{site.location}</p>
                  <p className="text-sm text-slate-300">Serving clients across the globe</p>
                </div>
              </div>
            )}
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-lg shadow-slate-200/60 sm:grid-cols-2 sm:p-8">
              <h3 className="text-xl font-semibold text-navy-950 sm:col-span-2">Project Inquiry</h3>

              {/* Honeypot: hidden from humans and assistive tech */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Website</label>
                <input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
              </div>

              <Field id="name" label="Full Name" required error={errors.name?.message}>
                <input id="name" autoComplete="name" className="field" {...a11y('name')} {...register('name')} />
              </Field>
              <Field id="email" label="Email" required error={errors.email?.message}>
                <input id="email" type="email" autoComplete="email" className="field" {...a11y('email')} {...register('email')} />
              </Field>

              <Field id="phone" label="Phone" error={errors.phone?.message}>
                <div className="flex gap-2">
                  <select aria-label="Country code" className="field !w-auto shrink-0 !px-2" {...register('countryCode')}>
                    {site.countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input id="phone" type="tel" autoComplete="tel-national" placeholder="300 1234567" className="field min-w-0" {...a11y('phone')} {...register('phone')} />
                </div>
              </Field>
              <Field id="company" label="Company">
                <input id="company" autoComplete="organization" className="field" {...register('company')} />
              </Field>

              <Field id="service" label="Service Interested In">
                <select id="service" className="field" {...register('service')}>
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.title}>{s.title}</option>
                  ))}
                  <option>Other / Not sure</option>
                </select>
              </Field>
              <Field id="budget" label="Budget Range">
                <select id="budget" className="field" {...register('budget')}>
                  <option value="">Select a budget</option>
                  {site.budgets.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </Field>

              <div className="sm:col-span-2">
                <Field id="message" label="Message" required error={errors.message?.message}>
                  <textarea id="message" rows={5} className="field resize-y" placeholder="Tell us about your project, goals and timeline…" {...a11y('message')} {...register('message')} />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-start gap-3 text-sm text-slate-600">
                  <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-blue-600" {...a11y('consent')} {...register('consent')} />
                  I agree that SyntaxWeb may store and use my details to respond to this inquiry.
                </label>
                {errors.consent && (
                  <p id="consent-error" role="alert" className="mt-1 text-xs text-red-600">
                    {errors.consent.message}
                  </p>
                )}
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary sm:col-span-2 sm:justify-self-start">
                {isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Send className="size-5" aria-hidden />}
                {isSubmitting ? 'Sending…' : 'Send Inquiry'}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
