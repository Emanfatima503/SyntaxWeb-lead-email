import { ImageResponse } from 'next/og';
import { site } from '@/config/site';

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          color: 'white',
          background: 'radial-gradient(circle at 75% 60%, #1D4ED8 0%, #0A1633 40%, #050B1F 75%)',
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: 10, color: '#60A5FA' }}>SOFTWARE HOUSE</div>
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, marginTop: 12 }}>
          {'</> Syntax'}
          <span style={{ color: '#3B82F6' }}>Web</span>
        </div>
        <div style={{ fontSize: 44, fontWeight: 700, marginTop: 28 }}>WE BUILD SOLUTIONS. WE GROW BUSINESSES.</div>
        <div style={{ fontSize: 28, marginTop: 20, color: '#CBD5E1' }}>{site.tagline}</div>
      </div>
    ),
    size,
  );
}
