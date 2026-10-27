import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { site } from '@/config/site';
import { services } from '@/config/services';
import ChatWidget from '@/components/ChatWidget';
import Floating from '@/components/Floating';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import './globals.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.title} | Websites, Apps & Digital Solutions`, template: `%s | ${site.name}` },
  description: site.description,
  keywords: ['software house', 'website development', 'mobile app development', 'UI/UX design', 'digital marketing', 'Pakistan', 'SyntaxWeb'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: site.url, siteName: site.name, title: site.title, description: site.description, locale: 'en_US' },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
};

export const viewport: Viewport = { themeColor: '#050B1F' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  name: site.name,
  description: site.description,
  url: site.url,
  logo: `${site.url}/icon.svg`,
  email: site.email,
  telephone: site.phone,
  areaServed: 'Worldwide',
  slogan: site.tagline,
  sameAs: Object.values(site.socials),
  makesOffer: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.description } })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-navy-950">
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <Floating />
          <ChatWidget />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
