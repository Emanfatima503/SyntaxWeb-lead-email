import type { Metadata } from 'next';
import CtaBanner from '@/components/CtaBanner';
import PageHeader from '@/components/PageHeader';
import WhyUs from '@/components/WhyUs';

const sub = 'Technology, talent and a commitment to results — everything your business needs to grow with confidence.';

export const metadata: Metadata = {
  title: 'Why Choose Us',
  description: sub,
  alternates: { canonical: '/why-us' },
};

export default function WhyUsPage() {
  return (
    <>
      <PageHeader crumb="Why Us" eyebrow="Why Choose SyntaxWeb" title="Your Trusted Partner for Digital Growth" sub={sub} />
      <WhyUs heading={false} />
      <CtaBanner />
    </>
  );
}
