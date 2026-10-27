import type { Metadata } from 'next';
import CtaBanner from '@/components/CtaBanner';
import PageHeader from '@/components/PageHeader';
import Process from '@/components/Process';

const sub = 'A clear and transparent process to deliver exceptional results.';

export const metadata: Metadata = {
  title: 'Our Process',
  description: sub,
  alternates: { canonical: '/process' },
};

export default function ProcessPage() {
  return (
    <>
      <PageHeader crumb="Process" eyebrow="Our Process" title="Our Proven Process for Success" sub={sub} />
      <Process heading={false} />
      <CtaBanner />
    </>
  );
}
