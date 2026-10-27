import { z } from 'zod';

// Shared by the browser forms (React Hook Form) and the API routes (server-side validation).

const str = (max: number) => z.string().trim().max(max);

export const metaSchema = z
  .object({
    utm_source: str(200),
    utm_medium: str(200),
    utm_campaign: str(200),
    utm_term: str(200),
    utm_content: str(200),
    referrer: str(1000),
    landing_page: str(1000),
    source_page: str(500),
  })
  .partial()
  .optional();

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(100),
  email: z.string().trim().email('Please enter a valid email address').max(200),
  countryCode: str(6),
  phone: z.string().trim().regex(/^[0-9\s()-]{0,20}$/, 'Use digits only').optional(),
  company: str(150).optional(),
  service: str(100).optional(),
  budget: str(100).optional(),
  message: z.string().trim().min(10, 'Please tell us a little more (min. 10 characters)').max(5000),
  consent: z.boolean().refine(Boolean, 'Please accept to continue'),
  website: z.string().optional(), // honeypot — must stay empty
});

export const newsletterSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(200),
  website: z.string().optional(),
});

export const chatSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  sessionId: str(100),
  // Earlier turns, sent by the browser (the server keeps no chat state).
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(4000) }))
    .max(30)
    .default([]),
});

/** A recorded voice message from the chat widget (base64 audio, max ~60 s). */
export const voiceSchema = chatSchema.omit({ message: true }).extend({
  audio: z.string().min(100).max(4_000_000), // ~3 MB of audio once decoded
  mimeType: z.string().regex(/^audio\/[a-z0-9.+-]+(;.*)?$/i).max(100),
});

/** What the AI agent's save_lead tool must supply before a lead is forwarded. */
export const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: str(40).optional(),
  company: str(150).optional(),
  service: str(100).optional(),
  budget: str(100).optional(),
  message: z.string().trim().min(5).max(5000),
});

export type ContactValues = z.infer<typeof contactSchema>;
export type NewsletterValues = z.infer<typeof newsletterSchema>;
