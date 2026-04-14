import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Curated Luxury Travel | Maison Resorts 2026',
  description: 'Explore European niche vacation spots defining 2026. Discover hidden gems from the Albanian Riviera to the Arctic Circle with Maison conscious luxury.',
  keywords: [
    'luxury travel Europe 2026',
    'niche vacation spots',
    'quiet luxury hotel Europe',
    'Albanian Riviera luxury',
    'hidden gems Europe',
    'Maison resorts',
    'conscious travel Europe'
  ].join(', '),
  openGraph: {
    title: 'Curated Luxury Travel | Maison Resorts',
    description: 'Discover the European hidden gems defining 2026 travel.',
    images: [{ url: 'https://images.unsplash.com/photo-1580220305417-10c036324200' }],
  }
};

export { default } from './page';
