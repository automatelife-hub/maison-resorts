'use client';

import Link from 'next/link';
import { usePreferences } from '@/context/PreferencesContext';
import { useAuth } from '@/context/AuthContext';

export default function Nav() {
  const { currency } = usePreferences();
  const { user, signOutUser, loading } = useAuth();

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
          
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link href="/account/profile" className="flex items-center gap-2">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || ''} 
                    className="w-8 h-8 rounded-full border border-accent" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent text-luxury flex items-center justify-center font-bold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                )}
                <span className="text-sm hidden md:block">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
              </Link>
              <button
                onClick={signOutUser}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-accent text-luxury px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
