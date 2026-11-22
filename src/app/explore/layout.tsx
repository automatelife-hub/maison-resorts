import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Destinations | Maison Resorts',
  description: 'Find and compare top resort destinations. Filter by location, price, and style to find your perfect vacation spot with instant booking.',
  keywords: [
    'resort destinations',
    'luxury resort search',
    'hotel collections',
    'beach resort destinations',
    'mountain lodging',
    'Maison resorts explore'
  ].join(', '),
  openGraph: {
    title: 'Explore resort destinations | Maison Resorts',
    description: 'Find and compare top resort destinations. Filter by location, price, and style to find your perfect vacation spot.',
    images: [{ url: 'https://images.unsplash.com/photo-1580220305417-10c036324200' }],
  }
};

export { default } from './page';
