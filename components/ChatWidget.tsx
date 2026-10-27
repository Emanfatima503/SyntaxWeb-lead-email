'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Bot, CheckCircle2, Loader2, Mic, Send, Sparkles, Square, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { submit } from '@/lib/client';

// The AI assistant: text → /api/chat, voice → /api/voice (n8n workflow or the built-in Groq agent).
// Set NEXT_PUBLIC_ENABLE_CHAT=false to hide it.
const ENABLED = process.env.NEXT_PUBLIC_ENABLE_CHAT !== 'false';
const MAX_RECORDING_MS = 60_000;

type Msg = { role: 'user' | 'assistant'; content: string };
type Reply = { reply?: string; output?: string; transcript?: string; leadSaved?: boolean };

const GREETING: Msg = {
  role: 'assistant',
  content: "Hi! 👋 I'm the SyntaxWeb AI assistant. Ask me about our services, or tell me about your project. You can type or tap the mic to talk.",
};
const STARTERS = ['What services do you offer?', 'How does your process work?', 'I need a website quote'];

const toBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '');
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

/** Read a reply aloud with the browser's built-in voice (no extra service). */
function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (/[؀-ۿ]/.test(text)) u.lang = 'ur-PK'; // Urdu script
  speechSynthesis.speak(u);
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [leadSaved, setLeadSaved] = useState(false);
  const [canRecord, setCanRecord] = useState(false);
  const [recording, setRecording] = useState(false);
  const sessionId = useRef('');
  const recorder = useRef<MediaRecorder | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    sessionId.current = crypto.randomUUID();
    setCanRecord('MediaRecorder' in window && !!navigator.mediaDevices?.getUserMedia);
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' }); // braces: newer browsers return a Promise here, which React rejects
  }, [msgs, busy]);
  useEffect(() => {
    if (open) inputRef.current?.focus();
    else {
      // Closing discards an in-progress recording instead of sending it.
      const rec = recorder.current;
      if (rec?.state === 'recording') {
        rec.onstop = () => {
          rec.stream.getTracks().forEach((t) => t.stop());
          setRecording(false);
        };
        rec.stop();
      }
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    }
  }, [open]);

  if (!ENABLED) return null;

  /** Shows the visitor's turn, calls the API, and appends the reply. Returns the reply text. */
  const ask = async (url: string, body: object, shown: string) => {
    const history = msgs.slice(-20); // last 20 turns are plenty of context for a site chat
    setMsgs((m) => [...m, { role: 'user', content: shown }]);
    setBusy(true);
    try {
      const data = await submit<Reply>(url, { ...body, sessionId: sessionId.current, history });
      const reply = data.reply ?? data.output ?? 'Thanks! We will get back to you shortly.';
      setMsgs((m) => [
        ...(data.transcript ? [...m.slice(0, -1), { role: 'user' as const, content: `🎤 ${data.transcript}` }] : m),
        { role: 'assistant', content: reply },
      ]);
      if (data.leadSaved) setLeadSaved(true);
      return reply;
    } catch (err) {
      setMsgs((m) => [...m, { role: 'assistant', content: (err as Error).message }]);
    } finally {
      setBusy(false);
    }
  };

  const send = (text: string) => {
    text = text.trim();
    if (!text || busy) return;
    setInput('');
    ask('/api/chat', { message: text }, text);
  };

  const sendVoice = async (blob: Blob) => {
    if (blob.size < 2000) return; // a tap, not a message
    const reply = await ask('/api/voice', { audio: await toBase64(blob), mimeType: blob.type || 'audio/webm' }, '🎤 Voice message…');
    if (reply) speak(reply);
  };

  const toggleRecording = async () => {
    if (recording) return recorder.current?.stop();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        sendVoice(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
      };
      rec.start();
      recorder.current = rec;
      setRecording(true);
      setTimeout(() => rec.state === 'recording' && rec.stop(), MAX_RECORDING_MS);
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: 'Microphone access is blocked, so I can’t hear you. You can type your message instead.' }]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with the SyntaxWeb AI assistant"
            className="absolute bottom-[4.5rem] right-0 flex h-[32rem] max-h-[calc(100dvh-7rem)] w-[calc(100vw-2.5rem)] max-w-sm origin-bottom-right flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-navy-950/40"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-hex flex items-center gap-3 bg-navy-950 px-4 py-3 text-white">
              <span className="relative grid size-9 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                <Bot className="size-5" aria-hidden />
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-navy-950 bg-emerald-400" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">SyntaxWeb AI Assistant</p>
                <p className="text-xs text-slate-300">Text or voice · usually replies in seconds</p>
              </div>
              <button type="button" aria-label="Close chat" onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-white/10">
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-surface p-4" aria-live="polite">
              {msgs.map((m, i) => (
                <p
                  key={i}
                  dir="auto"
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === 'user' ? 'ml-auto rounded-br-md bg-blue-600 text-white' : 'rounded-bl-md bg-white text-navy-950 shadow-sm'
                  }`}
                >
                  {m.content}
                </p>
              ))}
              {msgs.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-blue-500/30 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {busy && (
                <p className="flex w-fit items-center gap-2 rounded-2xl rounded-bl-md bg-white px-3.5 py-2 text-sm text-slate-600 shadow-sm">
                  <Loader2 className="size-4 animate-spin text-blue-600" aria-hidden /> Thinking…
                </p>
              )}
              {leadSaved && (
                <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="size-4" aria-hidden /> Your details were sent to our team.
                </p>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2 border-t border-slate-200 p-3"
            >
              {recording ? (
                <p className="flex flex-1 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-600" aria-live="assertive">
                  <span className="size-2.5 animate-pulse rounded-full bg-red-500" aria-hidden /> Listening… tap ■ to send
                </p>
              ) : (
                <>
                  <label htmlFor="chat-input" className="sr-only">
                    Message
                  </label>
                  <input
                    ref={inputRef}
                    id="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={1000}
                    placeholder="Type or tap the mic…"
                    className="field !py-2"
                    autoComplete="off"
                  />
                </>
              )}
              {canRecord && !input.trim() ? (
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={busy}
                  aria-label={recording ? 'Stop and send voice message' : 'Record a voice message'}
                  aria-pressed={recording}
                  className={`grid size-10 shrink-0 place-items-center rounded-full text-white transition disabled:opacity-60 ${
                    recording ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:shadow-[0_0_16px_rgb(59_130_246/0.6)]'
                  }`}
                >
                  {recording ? <Square className="size-4 fill-current" aria-hidden /> : <Mic className="size-5" aria-hidden />}
                </button>
              ) : (
                <button type="submit" disabled={busy || !input.trim()} aria-label="Send message" className="btn-primary !p-2.5">
                  <Send className="size-4" aria-hidden />
                </button>
              )}
            </form>
            <p className="bg-white pb-2 text-center text-[0.65rem] text-slate-500">AI assistant · answers may need confirmation by our team</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label={open ? 'Close AI assistant' : 'Chat with our AI assistant'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative grid size-14 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-600/40 transition hover:scale-105 hover:shadow-[0_0_28px_rgb(59_130_246/0.7)]"
      >
        {!open && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-blue-500/40 [animation-duration:2.5s]" />}
        {open ? <X className="size-6" aria-hidden /> : <Sparkles className="relative size-6" aria-hidden />}
      </button>
    </div>
  );
}
