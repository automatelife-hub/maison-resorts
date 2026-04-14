import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | Maison Resorts',
    default: 'Maison Resorts | Conscious Luxury & Heritage Sanctuaries',
  },
  description: 'Experience the art of the voyage with Maison Resorts. Curating the world’s most secluded European niche spots and heritage sanctuaries for the discerning traveler.',
  keywords: ['luxury travel 2026', 'heritage hotels Europe', 'conscious authenticity', 'niche vacation spots', 'private sanctuaries', 'Maison resorts'],
  openGraph: {
    title: 'Maison Resorts | Conscious Luxury',
    description: 'Curating the world’s most secluded heritage sanctuaries.',
    url: 'https://maisonresorts.com',
    siteName: 'Maison Resorts',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maison Resorts | Conscious Luxury',
    description: 'Curating the world’s most secluded heritage sanctuaries.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <Nav />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
