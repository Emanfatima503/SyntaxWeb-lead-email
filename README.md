# SyntaxWeb – Software House

Marketing website for SyntaxWeb with a built-in **AI support & sales assistant** (text + voice) powered by **Groq**.
Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide · React Hook Form + Zod · Groq SDK · n8n.

## Run it in VS Code

**You need:** [Node.js 20 or newer](https://nodejs.org) (LTS is fine) and [VS Code](https://code.visualstudio.com).

1. Unzip `SyntaxWeb.zip` somewhere (e.g. `Documents\SyntaxWeb`).
2. In VS Code: **File → Open Folder…** and pick the unzipped folder. Accept the prompt to install the recommended extensions.
3. Open the terminal: **Terminal → New Terminal** (`` Ctrl+` ``) and run:

   ```bash
   npm install
   ```

4. Turn on the AI assistant (optional, the site works without it):
   - Copy `.env.example` to a new file named `.env.local`.
   - Paste your Groq key after `GROQ_API_KEY=` (free at https://console.groq.com/keys).
5. Start the site:

   ```bash
   npm run dev
   ```

6. Open **http://localhost:3000**. Edits to any file reload the page automatically.

`Ctrl+C` in the terminal stops the server. For a production build: `npm run build` then `npm start`.

## Pages

| Page | URL | File |
| --- | --- | --- |
| Home | `/` | `app/page.tsx` — hero, vision banner, 6-service preview, CTA |
| About | `/about` | `app/about/page.tsx` |
| Services | `/services` | `app/services/page.tsx` — all 15 services with category filter |
| Process | `/process` | `app/process/page.tsx` |
| Why Us | `/why-us` | `app/why-us/page.tsx` |
| Contact | `/contact` | `app/contact/page.tsx` — inquiry form (`/contact?service=…` preselects a service) |

`app/layout.tsx` wraps every page with the navbar, footer, back-to-top button and AI assistant.

## Where things live

| Path | What |
| --- | --- |
| `config/site.ts` | **All business data**: name, emails, phone, socials, stats, budgets, nav, map embed |
| `config/services.ts` | The 15 services + categories (cards, filters, form dropdown, footer, JSON-LD **and the assistant's knowledge**) |
| `lib/agent.ts` | Built-in Groq assistant: system prompt, `save_lead` tool, Whisper transcription |
| `app/api/chat/route.ts` | Text messages → n8n workflow or built-in assistant |
| `app/api/voice/route.ts` | Voice messages → n8n workflow or Groq Whisper + built-in assistant |
| `components/ChatWidget.tsx` | Chat bubble and panel (typing, mic recording, read-aloud replies) |
| `n8n/syntaxweb-support-agent.json` | **n8n workflow** to import: support agent with tickets, escalation and voice |
| `lib/automation.ts` | n8n integration: payload envelope, webhook forwarding, rate limiting |
| `lib/schemas.ts` | Zod schemas shared by forms, API routes and the assistant's tool |
| `public/images/services/` | Service photos (Unsplash, free for commercial use) |

### Placeholders to replace before launch

In `config/site.ts`: the **stats numbers**, **social URLs** and **budget ranges** are marked `PLACEHOLDER`. Optionally set `mapEmbedUrl` (Google Maps → Share → Embed a map → copy the `src`).

## The AI assistant

The blue sparkle bubble (bottom-right on every page). Visitors can **type** or **tap the mic** to send a voice message (up to 60 s); voice replies are read aloud by the browser. It answers in English, Urdu or Roman Urdu.

It runs in one of two modes, picked automatically from `.env.local`:

| Setup | Who answers |
| --- | --- |
| `N8N_CHAT_WEBHOOK_URL` / `N8N_VOICE_WEBHOOK_URL` set | **Your n8n workflow** (`n8n/syntaxweb-support-agent.json`): Groq agent with memory, Google Sheets tickets/leads and Gmail escalation |
| Only `GROQ_API_KEY` set | **Built-in assistant** (`lib/agent.ts`): Groq `openai/gpt-oss-120b`, voice via Groq `whisper-large-v3-turbo`, leads sent to `N8N_CONTACT_WEBHOOK_URL` |
| Neither | A polite "assistant offline, use the contact page" message |
| `NEXT_PUBLIC_ENABLE_CHAT=false` | No bubble |

The built-in assistant:
- answers questions about SyntaxWeb, its 15 services, process and contact details (only from `config/site.ts` and `config/services.ts`; it won't invent prices, timelines or clients),
- **captures leads**: collects name, email and project details, reads them back, and after the visitor confirms calls its `save_lead` tool, which sends the lead to `N8N_CONTACT_WEBHOOK_URL` with `"type": "chat_lead"` (printed in the terminal until n8n is connected).

Notes:
- The Groq key and webhook URLs stay on the server; the browser only talks to `/api/chat` and `/api/voice`.
- Built-in mode: the conversation lives in the browser tab (last 20 messages sent with each question). n8n mode: the workflow keeps memory per `session_id`.
- Limits: 20 text and 10 voice messages per minute per visitor (per server instance).
- To change the model, edit `MODEL` in `lib/agent.ts`.

## Lead emails (assistant → your inbox)

When a visitor confirms their details to the built-in assistant, the lead is **emailed automatically to `eeshaeman02@gmail.com`** (code: `lib/mailer.ts`). The email has the client's name, email, phone, company, service, budget and project details, plus where they came from. **Reply** goes straight to the client.

It sends through a Gmail account using an **App Password** (works on localhost, no domain needed). One-time setup:

1. Pick the Gmail account that will *send* the emails (it can be `eeshaeman02@gmail.com` itself).
2. Turn on **2-Step Verification** for it: https://myaccount.google.com/security
3. Create an App Password: https://myaccount.google.com/apppasswords → name it `SyntaxWeb` → **Create** → copy the 16-character password.
4. Add two lines at the end of `.env.local` (leave everything else as is):

   ```
   SMTP_USER=the-sending-account@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop
   ```

5. Restart `npm run dev`.

The terminal shows `[mail] lead from … emailed to eeshaeman02@gmail.com` for each sent lead. If it shows `SMTP_USER / SMTP_PASS not set` or `Invalid login`, re-check step 4 (the App Password, not your normal Gmail password). Optional: `LEADS_EMAIL_TO=someone@example.com` sends the emails to a different address.

Without working email (and no n8n contact webhook), the assistant tells visitors it couldn't send and points them to the contact page, so no lead is silently lost. Each visitor can submit at most 3 leads per 10 minutes.

## Connecting the n8n support agent

`n8n/syntaxweb-support-agent.json` is a ready-made workflow: text and voice webhooks → Groq Whisper (voice) → Groq agent with conversation memory → tools to **create a ticket/lead in Google Sheets** and **escalate to a human by Gmail**.

1. In n8n: **Workflows → Import from File** → pick `n8n/syntaxweb-support-agent.json`.
2. Follow the **Setup Notes** sticky note inside the workflow:
   - **Header Auth** credential: Name `X-Webhook-Secret`, Value = your `N8N_WEBHOOK_SECRET`; select it on both webhooks.
   - **Groq** credential (your Groq key) on *Groq Chat Model*, and an **HTTP Header Auth** credential (`Authorization` = `Bearer YOUR_GROQ_KEY`) on *Transcribe (Groq Whisper)*.
   - Google Sheet with a **Tickets** tab and headers `ticket_id, created_at, type, name, email, phone, issue, urgency, status`; put its ID in *Create Ticket / Lead*.
   - **Gmail OAuth2** credential on *Escalate to Human* (alerts go to info@syntaxweb.com).
   - Replace `https://cal.com/syntaxweb` in the agent's system message with your booking link.
3. Activate the workflow and copy the two **Production URLs** into `.env.local`:

   ```
   N8N_CHAT_WEBHOOK_URL=https://YOUR-N8N/webhook/syntaxweb-support-chat
   N8N_VOICE_WEBHOOK_URL=https://YOUR-N8N/webhook/syntaxweb-support-voice
   N8N_WEBHOOK_SECRET=the-same-secret-as-the-header-auth-credential
   ```

4. Restart `npm run dev` (or redeploy). The bubble now talks to your workflow.

What the site sends (shared envelope: `type`, `timestamp`, `source_page`, `meta` with UTM/referrer/user agent):

```json
{ "type": "chat_message", "chat": { "session_id": "uuid", "message": "Hi, my site is down" } }
{ "type": "chat_voice",   "chat": { "session_id": "uuid", "audio_base64": "<base64>", "mime_type": "audio/webm", "ext": "webm" } }
```

The workflow replies `{ "reply": "...", "transcript": "...", "session_id": "uuid" }`, and the widget shows the transcript and reply.

## Other n8n webhooks

| Env var | Sent by | Payload `type` |
| --- | --- | --- |
| `N8N_CONTACT_WEBHOOK_URL` | Contact form, built-in assistant leads | `contact_form`, `chat_lead` |
| `N8N_NEWSLETTER_WEBHOOK_URL` | Footer newsletter | `newsletter_signup` |

Every request carries the header `X-Webhook-Secret` = `N8N_WEBHOOK_SECRET`. Leave a URL empty for **dev mode**: the request succeeds and the payload is printed in the terminal.

Contact payload:

```json
{
  "type": "contact_form",
  "timestamp": "2026-10-26T11:45:41.384Z",
  "source_page": "/contact",
  "lead": { "name": "Ali Khan", "email": "ali@example.com", "phone": "+92 300 1234567", "company": "Acme" },
  "project": { "service": "Website Development", "budget": "$1,000 – $5,000", "message": "We need a new corporate website." },
  "meta": { "utm_source": "google", "utm_medium": "", "utm_campaign": "", "utm_term": "", "utm_content": "", "referrer": "", "landing_page": "https://www.syntaxweb.com/?utm_source=google", "user_agent": "Mozilla/5.0 …" }
}
```

Suggested workflows: **leads** (`contact_form` + `chat_lead`) → Google Sheets / CRM → email to info@syntaxweb.com; **newsletter** → Mailchimp / Brevo (double opt-in).

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project**, import the repo (it detects Next.js).
3. Add the variables from `.env.example` under **Settings → Environment Variables** (at least `GROQ_API_KEY`, or the n8n chat/voice URLs + secret).
4. Deploy, then connect `www.syntaxweb.com` under **Settings → Domains**.

If you deploy to another domain, update `url` in `config/site.ts` (metadata, sitemap, robots, JSON-LD and the footer QR code use it). Spam protection: honeypot fields on forms + per-IP rate limits (in-memory per server instance; use Upstash Redis for a strict global limit).
