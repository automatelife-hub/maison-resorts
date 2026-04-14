'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { PriceDisplay } from '@/components/PriceDisplay';

export default function LoyaltyPage() {
  const { user, loading: authLoading } = useAuth();
  const [loyaltyData, setLoyaltyData] = useState<any>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading) setLoading(false);
      return;
    }

    const fetchLoyalty = async () => {
      try {
        setLoading(true);
        // Fetch loyalty info
        const loyaltyRes = await fetch(`/api/loyalty?guestId=${user.uid}`);
        if (loyaltyRes.ok) {
          const data = await loyaltyRes.json();
          setLoyaltyData(data);
        }

        // Fetch user vouchers
        const vouchersRes = await fetch(`/api/vouchers?guestId=${user.uid}`);
        if (vouchersRes.ok) {
          const data = await vouchersRes.json();
          setVouchers(data.vouchers || []);
        }
      } catch (err) {
        console.error('Failed to load loyalty info', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoyalty();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Skeleton className="h-12 w-1/3 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <EmptyState 
          title="Members Only" 
          description="Please sign in to view your Maison loyalty rewards and vouchers." 
          icon="🔒" 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">Member's Maison</h3>
        <h1 className="text-5xl font-bold text-luxury italic font-serif">Welcome back, <span className="text-accent">{user.displayName?.split(' ')[0] || 'Voyager'}</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Points Card */}
        <div className="bg-luxury text-white rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-8">Available Points</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-6xl font-bold text-accent">{loyaltyData?.points || 0}</span>
            <span className="text-sm text-gray-400 uppercase tracking-widest">pts</span>
          </div>
          <p className="text-xs text-gray-500 mb-8 leading-relaxed">Estimated value: <PriceDisplay price={(loyaltyData?.points || 0) * 0.01} currency="USD" className="text-white" /></p>
          <button className="w-full bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-accent hover:text-luxury transition-all text-[10px] uppercase tracking-widest">
            Redeem Points
          </button>
        </div>

        {/* Tier Card */}
        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-8">Status Level</p>
            <h2 className="text-3xl font-bold text-luxury italic font-serif mb-2">Heritage Member</h2>
            <p className="text-xs text-gray-500 mb-8">You are <span className="text-luxury font-bold">1,250 pts</span> away from the "Sanctuary" tier.</p>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-accent h-full w-1/3" />
          </div>
        </div>

        {/* Next Voyage Card */}
        <div className="bg-gray-50 rounded-[2rem] p-10 border border-gray-100 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-8">Next Voyage</p>
            <h2 className="text-xl font-bold text-luxury mb-2">No upcoming stays</h2>
            <p className="text-xs text-gray-500">Discover your next sanctuary in our 2026 collection.</p>
          </div>
          <a href="/explore" className="text-accent font-bold text-[10px] uppercase tracking-widest hover:translate-x-2 transition-transform inline-block">
            Explore Destinations →
          </a>
        </div>
      </div>

      {/* Vouchers Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-luxury mb-8 italic font-serif">Exclusive <span className="text-accent">Vouchers</span></h2>
        {vouchers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vouchers.map((v) => (
              <div key={v.id} className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 relative group hover:border-accent transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                    {v.discountType === 'percentage' ? `${v.value}% OFF` : `$${v.value} OFF`}
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">{v.code}</span>
                </div>
                <h3 className="font-bold text-luxury mb-2">{v.name}</h3>
                <p className="text-xs text-gray-500 mb-6">{v.description}</p>
                <button className="text-[10px] uppercase tracking-widest font-bold text-luxury group-hover:text-accent transition-colors">
                  Apply to Booking →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
            <p className="text-gray-400 text-sm">No vouchers available at this moment. Stays at our 2026 niche spots will unlock exclusive rewards.</p>
          </div>
        )}
      </div>
    </div>
  );
}
