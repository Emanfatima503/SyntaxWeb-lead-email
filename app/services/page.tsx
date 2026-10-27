import type { Metadata } from 'next';
import CtaBanner from '@/components/CtaBanner';
import PageHeader from '@/components/PageHeader';
import Services from '@/components/Services';

const sub = "We offer end-to-end digital services to help your business start, grow and scale in today's competitive market.";

export const metadata: Metadata = {
  title: 'Services',
  description: sub,
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader crumb="Services" eyebrow="Our Digital Services" title="Complete Digital Solutions Under One Roof" sub={sub} />
      <Services heading={false} />
      <CtaBanner />
    </>
  );
}
