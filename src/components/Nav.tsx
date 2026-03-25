'use client';

import Link from 'next/link';
import { usePreferences } from '@/context/PreferencesContext';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function Nav() {
  const { currency } = usePreferences();

  return (
    <nav className="bg-luxury text-white py-4 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-accent">
          Maison
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/explore" className="hover:text-accent transition-colors">
            Explore
          </Link>
          <Link href="/account/bookings" className="hover:text-accent transition-colors">
            Bookings
          </Link>
          <div className="text-sm text-gray-300">{currency}</div>
          <GoogleSignInButton />
        </div>
      </div>
    </nav>
  );
}
