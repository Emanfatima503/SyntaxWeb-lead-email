import type { MetadataRoute } from 'next';
import { site } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return site.nav.map((l) => ({
    url: `${site.url}${l.href === '/' ? '' : l.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: l.href === '/' ? 1 : 0.8,
  }));
}
