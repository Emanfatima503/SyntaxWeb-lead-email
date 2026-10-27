import nodemailer from 'nodemailer';

// Emails each lead the AI assistant captures to the team, through Gmail (SMTP + App Password).
// Needs SMTP_USER and SMTP_PASS in .env.local — see README → "Lead emails".

const LEADS_TO = process.env.LEADS_EMAIL_TO || 'eeshaeman02@gmail.com';

type LeadPayload = {
  timestamp: string;
  source_page: string;
  lead: { name: string; email: string; phone: string; company: string };
  project: { service: string; budget: string; message: string };
  meta: Record<string, string>;
};

const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim(); // keep visitor text out of email headers

/** Returns true when the email was accepted by Gmail. Never throws. */
export async function emailLead(p: LeadPayload): Promise<boolean> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s/g, ''); // Gmail shows App Passwords with spaces
  if (!user || !pass) {
    console.warn('[mail] SMTP_USER / SMTP_PASS not set in .env.local — lead was NOT emailed.');
    return false;
  }

  const { lead, project, meta } = p;
  const received = new Date(p.timestamp).toLocaleString('en-GB', { timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'short' });
  const text = [
    'New project request from the SyntaxWeb website AI assistant.',
    '',
    `Name:     ${lead.name}`,
    `Email:    ${lead.email}`,
    `Phone:    ${lead.phone || '-'}`,
    `Company:  ${lead.company || '-'}`,
    `Service:  ${project.service || '-'}`,
    `Budget:   ${project.budget || '-'}`,
    '',
    'Project details:',
    project.message,
    '',
    '---',
    `Received: ${received} (PKT)`,
    `Page:     ${p.source_page}`,
    `Source:   ${meta.utm_source || meta.referrer || 'direct'}${meta.utm_campaign ? ` / ${meta.utm_campaign}` : ''}`,
    '',
    'Reply to this email to answer the client directly.',
  ].join('\n');

  try {
    await nodemailer.createTransport({ service: 'gmail', auth: { user, pass } }).sendMail({
      from: { name: 'SyntaxWeb Assistant', address: user },
      to: LEADS_TO,
      replyTo: { name: oneLine(lead.name), address: lead.email },
      subject: oneLine(`New project request: ${project.service || 'General enquiry'} – ${lead.name}`),
      text,
    });
    console.log(`[mail] lead from ${lead.email} emailed to ${LEADS_TO}`);
    return true;
  } catch (err) {
    console.error('[mail] sending failed (check SMTP_USER / SMTP_PASS):', err);
    return false;
  }
}
