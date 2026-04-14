'use client';

import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { CurrencySelector } from '@/components/CurrencySelector';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { currency } = usePreferences();

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Skeleton className="h-12 w-1/3 mb-12" />
        <Skeleton className="h-64 w-full rounded-[2rem]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <EmptyState 
          title="Members Only" 
          description="Please sign in to manage your Maison profile and preferences." 
          icon="🔒" 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Member Profile</h3>
        <h1 className="text-5xl font-bold text-luxury italic font-serif">Account <span className="text-accent">Settings</span></h1>
      </div>

      <div className="space-y-8">
        {/* Personal Info */}
        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
          <div className="flex items-center gap-8 mb-10 pb-10 border-b border-gray-50">
            <div className="w-24 h-24 rounded-[2rem] bg-accent text-luxury flex items-center justify-center text-3xl font-bold italic shadow-xl shadow-accent/20">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover rounded-[2rem]" />
              ) : (
                user.email?.[0].toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-luxury">{user.displayName || 'Maison Voyager'}</h2>
              <p className="text-gray-500 uppercase tracking-widest text-[10px] mt-1 italic">Heritage Member since 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Email Address</label>
              <p className="px-5 py-3 rounded-xl bg-gray-50 text-luxury font-medium border border-transparent">{user.email}</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Account ID</label>
              <p className="px-5 py-3 rounded-xl bg-gray-50 text-gray-400 font-mono text-xs border border-transparent truncate">{user.uid}</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
          <h3 className="text-[10px] uppercase tracking-widest text-accent mb-8">Travel Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Preferred Currency</label>
              <CurrencySelector />
              <p className="text-[10px] text-gray-400 px-1 italic">Prices across the platform will be shown in {currency}.</p>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Communication</label>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-50 border border-transparent">
                <input type="checkbox" checked readOnly className="accent-accent" />
                <span className="text-sm text-luxury font-medium">Receive luxury discovery updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-gray-50 rounded-[2rem] p-10 border border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-luxury italic font-serif">Security & Privacy</h3>
            <p className="text-xs text-gray-500 mt-1">Manage your password and third-party connections.</p>
          </div>
          <button className="text-[10px] uppercase tracking-widest font-bold text-accent border border-accent/20 px-6 py-2 rounded-xl hover:bg-accent hover:text-luxury transition-all">
            Update Security
          </button>
        </div>
      </div>
    </div>
  );
}
