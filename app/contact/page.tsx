import type { Metadata } from 'next';
import Contact from '@/components/Contact';
import PageHeader from '@/components/PageHeader';

const sub = "Have a project in mind? Let's discuss how we can help you achieve your goals.";

export const metadata: Metadata = {
  title: 'Contact',
  description: sub,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader crumb="Contact" eyebrow="Contact Us" title="Let's Talk About Your Project" sub={sub} />
      <Contact heading={false} />
    </>
  );
}
