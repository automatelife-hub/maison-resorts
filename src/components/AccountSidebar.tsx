'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Compass, 
  User, 
  Award, 
  Heart, 
  LogOut, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
  { href: '/account/bookings', label: 'Bookings', icon: Compass },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account/loyalty', label: 'Loyalty', icon: Award },
  { href: '/account/favorites', label: 'Wishlist', icon: Heart },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { signOutUser, user } = useAuth();

  return (
    <div className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-24 space-y-6">
        {/* User Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 p-0.5 border border-gray-200 shadow-inner mb-4 relative flex items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || ''} 
                  className="w-full h-full object-cover rounded-full" 
                />
              ) : (
                <div className="w-full h-full bg-gray-800 text-white flex items-center justify-center text-lg font-serif italic rounded-full">
                  {user?.email?.[0].toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-white border border-gray-200 p-1 rounded-full shadow-sm">
                <ShieldCheck size={10} className="text-green-600" />
              </div>
            </div>
            
            <h2 className="text-gray-900 font-semibold text-base leading-tight">
              {user?.displayName || 'Guest'}
            </h2>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1">
              Member
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center justify-between px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                      isActive 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={14} className={isActive ? 'text-gray-900' : 'text-gray-450'} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight size={12} className="text-gray-550" />}
                  </div>
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-gray-150">
              <button
                onClick={signOutUser}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50/50 rounded transition-colors text-xs font-semibold uppercase tracking-wider"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Status indicator */}
        <div className="px-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
            Secure Connection
          </span>
        </div>
      </div>
    </div>
  );
}
