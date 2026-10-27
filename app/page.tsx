import CtaBanner from '@/components/CtaBanner';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import VisionBanner from '@/components/VisionBanner';

export default function HomePage() {
  return (
    <>
      <Hero />
      <VisionBanner />
      <Services limit={6} />
      <CtaBanner />
    </>
  );
}
