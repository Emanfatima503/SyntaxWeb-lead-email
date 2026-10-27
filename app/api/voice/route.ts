import { NextResponse } from 'next/server';
import { agentError, offline, runAgent, transcribe } from '@/lib/agent';
import { clientIp, handle, rateLimited } from '@/lib/automation';
import { metaSchema, voiceSchema } from '@/lib/schemas';

export const maxDuration = 60;

const extOf = (mime: string) => mime.split('/')[1]?.split(';')[0]?.replace('x-', '') || 'webm';

export async function POST(req: Request) {
  // n8n workflow connected → it transcribes (Groq Whisper) and answers. Neither configured → dev mode.
  if (process.env.N8N_VOICE_WEBHOOK_URL || !process.env.GROQ_API_KEY) {
    return handle(req, {
      type: 'chat_voice',
      schema: voiceSchema,
      env: 'N8N_VOICE_WEBHOOK_URL',
      limit: 10,
      build: (d) => ({ chat: { session_id: d.sessionId, audio_base64: d.audio, mime_type: d.mimeType.split(';')[0], ext: extOf(d.mimeType) } }),
      devData: { reply: offline, transcript: '' },
    });
  }

  // Otherwise: Groq Whisper → built-in Groq agent.
  if (rateLimited(`voice:${clientIp(req)}`, 10)) {
    return NextResponse.json({ ok: false, error: 'Too many voice messages. Please wait a minute and try again.' }, { status: 429 });
  }
  const parsed = voiceSchema.extend({ meta: metaSchema }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Voice message could not be sent. Please try a shorter recording.' }, { status: 400 });
  }
  try {
    const { audio, mimeType, history, meta } = parsed.data;
    const transcript = await transcribe(audio, mimeType.split(';')[0], extOf(mimeType));
    if (!transcript) {
      return NextResponse.json({ ok: true, data: { transcript: '', reply: "Sorry, I couldn't hear anything. Please try again or type your message." } });
    }
    const result = await runAgent(req, history, transcript, meta, 'voice');
    return NextResponse.json({ ok: true, data: { ...result, transcript } });
  } catch (err) {
    return agentError(err);
  }
}
