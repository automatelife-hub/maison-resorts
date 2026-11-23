'use client';

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
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3 rounded bg-gray-100" />
        <Skeleton className="h-48 w-full rounded bg-gray-100" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-16">
        <EmptyState 
          title="Members Only" 
          description="Please sign in to manage your profile and preferences." 
          icon="🔒" 
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8 text-gray-800">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1 block">Member Settings</span>
        <h1 className="text-3xl font-serif text-gray-900 font-normal">
          Account Profile
        </h1>
      </div>

      <div className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-gray-150">
            <div className="w-24 h-24 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center text-3xl font-serif italic shadow-inner border border-gray-200 relative shrink-0">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover rounded-full" />
              ) : (
                user.email?.[0].toUpperCase()
              )}
              <div className="absolute bottom-0 right-0 bg-white border border-gray-200 p-1.5 rounded-full shadow-sm">
                 <Shield size={12} className="text-green-600" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-900">{user.displayName || 'Voyager'}</h2>
              <p className="text-gray-400 text-xs mt-1">Verified Member</p>
              <button className="mt-4 text-xs font-semibold text-gray-900 underline hover:text-gray-700 transition-colors">
                Change Profile Photo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Email Address</label>
              <div className="px-4 py-2.5 rounded bg-gray-50 text-gray-800 text-xs font-semibold border border-gray-200">
                {user.email}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">User Identifier ID</label>
              <div className="px-4 py-2.5 rounded bg-gray-50 text-gray-500 font-mono text-xs border border-gray-200 truncate">
                {user.uid}
              </div>
            </div>
          </div>
        </div>

        {/* Travel Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
                 <CreditCard size={15} className="text-gray-500" /> Preferred Currency
              </h3>
              <div className="space-y-4">
                <CurrencySelector />
                <p className="text-xs text-gray-450 leading-relaxed">
                  Prices across properties will display in <span className="font-semibold text-gray-850">{currency}</span>.
                </p>
              </div>
           </div>

           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
                 <Bell size={15} className="text-gray-500" /> Notifications
              </h3>
              <div className="flex items-center gap-3 px-4 py-3 rounded bg-gray-50 border border-gray-200">
                <input type="checkbox" checked readOnly className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer" />
                <span className="text-xs text-gray-600 font-semibold">Email Discovery Updates</span>
              </div>
           </div>
        </div>

        {/* Security Box */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shrink-0">
               <Shield size={18} />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-sm font-semibold text-gray-900">Security Credentials</h3>
              <p className="text-xs text-gray-500">Rotate security keys and manage active sessions.</p>
            </div>
          </div>
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all">
            Update Security
          </button>
        </div>
      </div>
    </div>
  );
}
