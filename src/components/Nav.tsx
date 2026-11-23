'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { CurrencySelector } from './CurrencySelector';
import { Plane, Building2 } from 'lucide-react';

export default function Nav() {
  const { user, signOutUser, loading } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-150 py-5 sticky top-0 z-40 shadow-sm text-gray-850">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-serif text-gray-900 font-bold tracking-tight">
            MAISON
          </Link>
          
          <div className="hidden md:flex gap-10 items-center text-[10px] uppercase tracking-[0.3em] font-bold">
            <Link href="/results" className="group flex items-center gap-2 hover:text-accent transition-all">
              <Building2 size={12} className="text-accent/60 group-hover:text-accent transition-colors" />
              Hotels
            </Link>
            <Link href="/flights" className="group flex items-center gap-2 hover:text-accent transition-all">
              <Plane size={12} className="text-accent/60 group-hover:text-accent transition-colors" />
              Flights
            </Link>
            <Link href="/explore" className="hover:text-accent transition-colors">
              Explore
            </Link>
            <Link href="/journal" className="hover:text-accent transition-colors">
              Guides
            </Link>
          </div>
        </div>
        
        <div className="flex gap-6 items-center">
          <CurrencySelector />
          
          <div className="h-4 w-[1px] bg-gray-200 hidden md:block" />
          
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link href="/account/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 group-hover:border-gray-400 transition-all p-0.5">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || ''} 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 text-white flex items-center justify-center font-bold text-xs rounded-full">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[10px] text-gray-400 uppercase">Member</p>
                  <p className="text-xs font-semibold text-gray-800">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </p>
                </div>
              </Link>
              <button
                onClick={signOutUser}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors border-l border-gray-200 pl-4"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
