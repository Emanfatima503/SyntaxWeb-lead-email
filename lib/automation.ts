import { NextResponse } from 'next/server';
import { z } from 'zod';
import { metaSchema } from './schemas';

// Single integration layer: every API route funnels through handle(), which validates,
// rate-limits, shapes the payload and forwards it to n8n. Webhook URLs stay server-side.

type WebhookEnv = 'N8N_CONTACT_WEBHOOK_URL' | 'N8N_NEWSLETTER_WEBHOOK_URL' | 'N8N_CHAT_WEBHOOK_URL' | 'N8N_VOICE_WEBHOOK_URL';

// ponytail: in-memory per-instance limiter; on multi-instance/serverless scale swap for Upstash/Redis.
const hits = new Map<string, number[]>();
export function rateLimited(key: string, limit: number, windowMs = 60_000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}

export async function handle<S extends z.AnyZodObject>(
  req: Request,
  opts: {
    type: string;
    schema: S;
    env: WebhookEnv;
    limit: number;
    build: (data: z.infer<S>) => Record<string, unknown>;
    devData?: Record<string, unknown>;
  },
) {
  if (rateLimited(`${opts.type}:${clientIp(req)}`, opts.limit)) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Please wait a minute and try again.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = opts.schema.extend({ meta: metaSchema }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Please check the highlighted fields.', fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Honeypot filled → pretend success so bots learn nothing.
  if (data.website) return NextResponse.json({ ok: true });

  const payload = envelope(req, opts.type, data.meta, opts.build(data));
  const result = await forward(opts.env, payload);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: 'We could not send your request right now. Please try again shortly.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true, ...(result.devMode && { devMode: true }), data: result.devMode ? (opts.devData ?? {}) : result.data });
}

export function clientIp(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'local';
}

/** The shared JSON shape every n8n webhook receives. */
export function envelope(req: Request, type: string, rawMeta: unknown, body: Record<string, unknown>) {
  const { source_page = '/', ...meta } = (rawMeta ?? {}) as Record<string, string>;
  return {
    type,
    timestamp: new Date().toISOString(),
    source_page,
    ...body,
    meta: {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
      referrer: '',
      landing_page: '',
      ...meta,
      user_agent: req.headers.get('user-agent') ?? '',
    },
  };
}

/** POST to an n8n webhook with the shared secret. Unset URL = dev mode: log and succeed. */
export async function forward(env: WebhookEnv, payload: Record<string, unknown>): Promise<{ ok: boolean; devMode?: boolean; data?: unknown }> {
  const url = process.env[env];
  if (!url) {
    // Long strings (e.g. base64 audio) are shortened so the terminal stays readable.
    const shown = JSON.stringify(payload, (_, v) => (typeof v === 'string' && v.length > 300 ? `${v.slice(0, 60)}… (${v.length} chars)` : v), 2);
    console.log(`[automation:dev-mode] ${env} not set — payload:\n${shown}`);
    return { ok: true, devMode: true };
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET ?? '' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`n8n responded ${res.status}`);
    return { ok: true, data: await res.json().catch(() => ({})) };
  } catch (err) {
    console.error(`[automation] ${payload.type} forward failed:`, err);
    return { ok: false };
  }
}
