'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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
  { href: '/account/bookings', label: 'Voyages', icon: Compass },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account/loyalty', label: 'Loyalty', icon: Award },
  { href: '/account/favorites', label: 'Vault', icon: Heart },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { signOutUser, user } = useAuth();

  return (
    <div className="w-72 shrink-0 hidden md:block">
      <div className="sticky top-32 space-y-8">
        {/* User Card (Glassmorphism) */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-accent/10 transition-colors duration-700" />
          
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-24 rounded-[2rem] bg-accent/20 p-0.5 border border-accent/30 shadow-lg shadow-accent/10 mb-6 relative group/avatar">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || ''} 
                  className="w-full h-full object-cover rounded-[1.8rem]" 
                />
              ) : (
                <div className="w-full h-full bg-luxury text-accent flex items-center justify-center text-2xl font-serif italic rounded-[1.8rem] border border-white/5">
                  {user?.email?.[0].toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-luxury border border-accent/30 p-1.5 rounded-xl shadow-lg">
                <ShieldCheck size={12} className="text-accent" />
              </div>
            </div>
            
            <h2 className="text-white font-bold tracking-tighter italic font-serif text-lg leading-tight">
              {user?.displayName || 'Voyager'}
            </h2>
            <p className="text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold mt-2">
              Heritage Member
            </p>
          </div>
        </div>

        {/* Navigation Cockpit */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-4 shadow-2xl">
          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group ${
                      isActive 
                        ? 'bg-white text-luxury shadow-xl shadow-white/5' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={16} className={isActive ? 'text-accent' : 'group-hover:text-accent transition-colors'} />
                      <span className="text-[10px] uppercase tracking-widest font-bold">
                        {item.label}
                      </span>
                    </div>
                    {isActive && (
                      <motion.div layoutId="active-pill">
                        <ChevronRight size={14} className="text-accent" />
                      </motion.div>
                    )}
                  </motion.div>
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-white/5">
              <button
                onClick={signOutUser}
                className="w-full flex items-center gap-4 px-6 py-4 text-gray-500 hover:text-red-400 transition-all group"
              >
                <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Sign Out</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Status indicator */}
        <div className="px-8 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[8px] uppercase tracking-[0.2em] text-gray-600 font-bold">
            Secure Member Connection
          </span>
        </div>
      </div>
    </div>
  );
}
