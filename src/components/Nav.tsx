'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CurrencySelector } from './CurrencySelector';

export default function Nav() {
  const { user, signOutUser, loading } = useAuth();

  return (
    <nav className="bg-luxury/95 backdrop-blur-md text-white py-6 sticky top-0 z-40 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-white tracking-tighter italic font-serif group">
          MAISON <span className="text-accent group-hover:text-white transition-colors">Resorts</span>
        </Link>
        
        <div className="flex gap-10 items-center">
          <div className="hidden md:flex gap-8 items-center text-[10px] uppercase tracking-[0.2em] font-bold">
            <Link href="/explore" className="hover:text-accent transition-colors">
              Explore
            </Link>
            <Link href="/account/bookings" className="hover:text-accent transition-colors">
              Voyages
            </Link>
          </div>

          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
          
          <CurrencySelector />
          
          {loading ? (
            <div className="w-8 h-8 rounded-xl bg-white/5 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-6">
              <Link href="/account/profile" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 group-hover:border-accent transition-all p-0.5">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || ''} 
                      className="w-full h-full object-cover rounded-[10px]" 
                    />
                  ) : (
                    <div className="w-full h-full bg-accent text-luxury flex items-center justify-center font-bold text-xs rounded-[10px]">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[8px] uppercase tracking-widest text-gray-400 group-hover:text-accent transition-colors">Member</p>
                  <p className="text-[10px] font-bold tracking-widest uppercase">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </p>
                </div>
              </Link>
              <button
                onClick={signOutUser}
                className="text-[8px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors font-bold border-l border-white/10 pl-6"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-accent text-luxury px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-accent/10"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
