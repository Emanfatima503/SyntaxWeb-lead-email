import { handle } from '@/lib/automation';
import { newsletterSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  return handle(req, {
    type: 'newsletter_signup',
    schema: newsletterSchema,
    env: 'N8N_NEWSLETTER_WEBHOOK_URL',
    limit: 5,
    build: (d) => ({ subscriber: { email: d.email } }),
  });
}
