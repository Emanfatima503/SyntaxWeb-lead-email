import { NextResponse } from 'next/server';
import { agentError, offline, runAgent } from '@/lib/agent';
import { clientIp, handle, rateLimited } from '@/lib/automation';
import { chatSchema, metaSchema } from '@/lib/schemas';

export const maxDuration = 60; // agent turns with a tool call can take a while (Vercel function limit)

export async function POST(req: Request) {
  // n8n workflow connected (n8n/syntaxweb-support-agent.json) → it answers.
  // No workflow and no Groq key → dev mode: the "offline" reply.
  if (process.env.N8N_CHAT_WEBHOOK_URL || !process.env.GROQ_API_KEY) {
    return handle(req, {
      type: 'chat_message',
      schema: chatSchema,
      env: 'N8N_CHAT_WEBHOOK_URL',
      limit: 20,
      build: (d) => ({ chat: { session_id: d.sessionId, message: d.message } }),
      devData: { reply: offline },
    });
  }

  // Otherwise the built-in Groq agent (lib/agent.ts) answers.
  if (rateLimited(`chat:${clientIp(req)}`, 20)) {
    return NextResponse.json({ ok: false, error: 'Too many messages. Please wait a minute and try again.' }, { status: 429 });
  }
  const parsed = chatSchema.extend({ meta: metaSchema }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Message could not be sent.' }, { status: 400 });
  }
  try {
    const { message, history, meta } = parsed.data;
    return NextResponse.json({ ok: true, data: await runAgent(req, history, message, meta) });
  } catch (err) {
    return agentError(err);
  }
}
