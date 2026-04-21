'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { CurrencySelector } from '@/components/CurrencySelector';
import { Shield, Bell, CreditCard } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { currency } = usePreferences();

  if (authLoading) {
    return (
      <div className="space-y-12">
        <Skeleton className="h-12 w-1/3 rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-[3rem]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-24">
        <EmptyState 
          title="Members Only" 
          description="Please sign in to manage your Maison profile and preferences." 
          icon="🔒" 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-16 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4 font-bold">Member Profile</h3>
        <h1 className="text-5xl font-bold text-white italic font-serif tracking-tighter">
          Account <span className="text-accent">Settings</span>
        </h1>
      </motion.div>

      <div className="space-y-8">
        {/* Personal Info */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-center gap-10 mb-12 pb-12 border-b border-white/5">
            <div className="w-32 h-32 rounded-[2.5rem] bg-accent/20 text-accent flex items-center justify-center text-4xl font-serif italic shadow-2xl border border-accent/30 relative">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover rounded-[2.5rem]" />
              ) : (
                user.email?.[0].toUpperCase()
              )}
              <div className="absolute -bottom-2 -right-2 bg-luxury border border-accent/30 p-2 rounded-2xl shadow-xl">
                 <Shield size={16} className="text-accent" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white tracking-tight">{user.displayName || 'Maison Voyager'}</h2>
              <p className="text-gray-500 uppercase tracking-[0.2em] text-[10px] mt-2 italic font-bold">Heritage Member since 2026</p>
              <button className="mt-6 text-[8px] uppercase tracking-widest text-accent font-bold border-b border-accent/20 pb-1 hover:border-accent transition-all">
                Update Visual Identity
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 px-1 font-bold">Email Access</label>
              <div className="px-6 py-4 rounded-2xl bg-white/5 text-white font-medium border border-white/5 shadow-inner">
                {user.email}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 px-1 font-bold">Account Key</label>
              <div className="px-6 py-4 rounded-2xl bg-white/5 text-gray-500 font-mono text-xs border border-white/5 truncate">
                {user.uid}
              </div>
            </div>
          </div>
        </div>

        {/* Travel Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-8 font-bold flex items-center gap-3">
                 <CreditCard size={14} /> Currency
              </h3>
              <div className="space-y-6">
                <CurrencySelector />
                <p className="text-[10px] text-gray-500 italic leading-relaxed">
                  Our algorithm will automatically rebalance all heritage rates to <span className="text-white font-bold">{currency}</span>.
                </p>
              </div>
           </div>

           <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-8 font-bold flex items-center gap-3">
                 <Bell size={14} /> Intelligence
              </h3>
              <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/5">
                <input type="checkbox" checked readOnly className="w-4 h-4 rounded border-white/10 bg-white/5 text-accent focus:ring-accent" />
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Discovery Updates</span>
              </div>
           </div>
        </div>

        {/* Security Alert */}
        <div className="bg-gradient-to-r from-accent/10 to-transparent rounded-[2.5rem] p-8 border border-accent/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
               <Shield size={20} />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-white font-bold italic font-serif">Security Protocol</h3>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Manage encryption and third-party access.</p>
            </div>
          </div>
          <button className="text-[10px] uppercase tracking-widest font-bold text-luxury bg-accent px-8 py-3 rounded-xl hover:bg-white transition-all shadow-xl shadow-accent/10">
            Rotate Keys
          </button>
        </div>
      </div>
    </div>
  );
}
