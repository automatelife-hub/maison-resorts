'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { PriceDisplay } from '@/components/PriceDisplay';
import { Award, ChevronRight } from 'lucide-react';
import { VoucherVault } from '@/components/VoucherVault';

export default function LoyaltyPage() {
  const { user, loading: authLoading } = useAuth();
  const [loyaltyData, setLoyaltyData] = useState<any>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLoyalty = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/loyalty?guestId=${user.uid}`);
        if (response.ok) {
          const apiLoyaltyData = await response.json();
          setLoyaltyData((prev: any) => ({ ...prev, ...apiLoyaltyData }));
        }

        const { getFirebaseFirestore } = await import('@/lib/firebase');
        const { doc, getDoc, collection, getDocs } = await import('firebase/firestore');
        const db = await getFirebaseFirestore();

        // Fetch loyalty info from Firestore
        const loyaltyRef = doc(db, `users/${user.uid}/loyalty`, 'status');
        const loyaltySnap = await getDoc(loyaltyRef);
        if (loyaltySnap.exists()) {
          setLoyaltyData((prev: any) => ({ ...prev, ...loyaltySnap.data() }));
        } else if (!loyaltyData) {
          setLoyaltyData({ points: 0, tier: 'Maison Member' });
        }

        // Fetch user vouchers from Firestore
        const vouchersRef = collection(db, `users/${user.uid}/vouchers`);
        const vouchersSnap = await getDocs(vouchersRef);
        const fetchedVouchers: any[] = [];
        vouchersSnap.forEach((doc) => {
          fetchedVouchers.push({ id: doc.id, ...doc.data() });
        });
        
        // Mocks for display
        if (fetchedVouchers.length === 0) {
          fetchedVouchers.push(
            { id: 'v1', name: 'Winter Promotion', code: 'MAISON-WINTER-26', value: 15, discountType: 'percentage', description: 'Exclusive winter discount' },
            { id: 'v2', name: 'Alps Escapes', code: 'ALPS-ELITE', value: 250, discountType: 'fixed', description: 'Premium alpine resort discount' }
          );
        }
        setVouchers(fetchedVouchers);
        
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
      <div className="space-y-8">
        <Skeleton className="h-8 w-1/3 rounded bg-gray-100" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <Skeleton className="h-64 lg:col-span-2 rounded bg-gray-100" />
           <Skeleton className="h-64 rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-16">
        <EmptyState 
          title="Members Only" 
          description="Please sign in to view your loyalty rewards and vouchers." 
          icon="🔒" 
        />
      </div>
    );
  }

  const currentPoints = loyaltyData?.points || 0;
  const nextTierPoints = 5000;
  const progress = Math.min(100, (currentPoints / nextTierPoints) * 100);

  return (
    <div className="space-y-12 text-gray-800">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1 block">Account Rewards</span>
        <h1 className="text-3xl font-serif text-gray-900 font-normal">
          Maison Loyalty Program
        </h1>
      </div>

      {/* The Ascent & Points */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Points & Progress Card */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-8 relative overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Simple Progress Bar */}
            <div className="relative w-full md:w-32 flex flex-col items-center">
              <span className="text-xs font-semibold text-gray-700 mb-2">Tier Progress</span>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-900 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-2">{progress.toFixed(0)}% to Next Tier</span>
            </div>

            {/* Points Info */}
            <div className="flex-1 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Accumulated Points</span>
              <div className="flex items-baseline justify-center md:justify-start gap-2 mb-3">
                <span className="text-6xl font-serif font-bold text-gray-900">
                  {currentPoints}
                </span>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">PTS</span>
              </div>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                You are currently in the <span className="text-gray-900 font-semibold">Maison Member</span> tier.
                Earn <span className="text-gray-900 font-semibold">{nextTierPoints - currentPoints} more points</span> to upgrade.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors">
                  Redeem Rewards
                </button>
                <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors">
                  Point History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div>
            <Award className="text-gray-700 mb-4" size={24} />
            <h3 className="text-base font-semibold text-gray-900 mb-4">Tier Privileges</h3>
            <ul className="space-y-3">
              {[
                'Priority Resort Booking',
                'Complimentary Late Check-out',
                'Welcome Gift in Room',
                'Member-Only Rates'
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-gray-400">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <button className="text-xs font-semibold text-gray-900 hover:text-gray-700 transition-colors mt-6 flex items-center gap-1">
            View All Privileges <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Vouchers Section */}
      <section className="pt-6">
        <div className="text-center mb-8">
           <h2 className="text-2xl font-serif text-gray-900 font-normal mb-1">Your Vouchers</h2>
           <p className="text-xs text-gray-500">Apply these promo codes during booking checkout</p>
        </div>

        {vouchers.length > 0 ? (
          <VoucherVault vouchers={vouchers} />
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-16 text-center max-w-xl mx-auto">
             <p className="text-gray-500 text-sm">Your voucher vault is empty.</p>
          </div>
        )}
      </section>
    </div>
  );
}
