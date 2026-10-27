'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { submit } from '@/lib/client';
import { newsletterSchema, type NewsletterValues } from '@/lib/schemas';

export default function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema), defaultValues: { email: '', website: '' } });

  const onSubmit = async (v: NewsletterValues) => {
    try {
      await submit('/api/newsletter', v);
      toast.success('You are subscribed! Watch your inbox for updates.');
      reset();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-md">
      <input aria-hidden tabIndex={-1} autoComplete="off" className="hidden" {...register('website')} />
      <div className="flex rounded-full border border-white/15 bg-white/5 p-1 focus-within:border-blue-400">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          aria-invalid={errors.email ? true : undefined}
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-slate-400 focus:outline-none"
          {...register('email')}
        />
        <button type="submit" disabled={isSubmitting} className="btn-primary !px-4 !py-2.5 text-sm" aria-label="Subscribe to newsletter">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
          <span className="hidden sm:inline">Subscribe</span>
        </button>
      </div>
      {errors.email && (
        <p role="alert" className="mt-2 px-4 text-xs text-red-400">
          {errors.email.message}
        </p>
      )}
    </form>
  );
}
