import { handle } from '@/lib/automation';
import { contactSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  return handle(req, {
    type: 'contact_form',
    schema: contactSchema,
    env: 'N8N_CONTACT_WEBHOOK_URL',
    limit: 5,
    build: (d) => ({
      lead: { name: d.name, email: d.email, phone: d.phone ? `${d.countryCode} ${d.phone}` : '', company: d.company ?? '' },
      project: { service: d.service ?? '', budget: d.budget ?? '', message: d.message },
    }),
  });
}
