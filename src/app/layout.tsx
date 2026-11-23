import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | Maison Resorts',
    default: 'Maison Resorts | Simple & Reliable Resort Bookings',
  },
  description: 'Book your next resort stay and flight with Maison Resorts. Browse hand-picked properties, enjoy instant confirmation, and experience hassle-free booking.',
  keywords: ['resort bookings', 'luxury hotels', 'book flights and hotels', 'vacation packages', 'hotel deals', 'Maison resorts'],
  openGraph: {
    title: 'Maison Resorts | Hotel & Flight Bookings',
    description: 'Find and book hand-picked resorts with direct flight connections and instant confirmation.',
    url: 'https://maisonresorts.com',
    siteName: 'Maison Resorts',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maison Resorts | Hotel & Flight Bookings',
    description: 'Find and book hand-picked resorts with direct flight connections and instant confirmation.',
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
