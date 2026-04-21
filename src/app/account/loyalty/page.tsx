'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { PriceDisplay } from '@/components/PriceDisplay';
import { Award, ChevronRight, Sparkles } from 'lucide-react';
import { VoucherVault } from '@/components/VoucherVault';

export default function LoyaltyPage() {
  const { user, loading: authLoading } = useAuth();
  const [loyaltyData, setLoyaltyData] = useState<any>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [globalVouchers, setGlobalVouchers] = useState<any[]>([]);
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
        
        // Fetch from API routes in parallel
        const [loyaltyRes, globalVouchersRes] = await Promise.all([
          fetch(`/api/loyalty?guestId=${user.uid}`),
          fetch('/api/vouchers')
        ]);

        if (loyaltyRes.ok) {
          const apiLoyaltyData = await loyaltyRes.json();
          setLoyaltyData((prev: any) => ({ ...prev, ...apiLoyaltyData }));
        }

        if (globalVouchersRes.ok) {
          const apiGlobalVouchers = await globalVouchersRes.json();
          setGlobalVouchers(apiGlobalVouchers.data || []);
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
          setLoyaltyData({ points: 0, tier: 'Heritage Member' });
        }

        // Fetch user vouchers from Firestore
        const vouchersRef = collection(db, `users/${user.uid}/vouchers`);
        const vouchersSnap = await getDocs(vouchersRef);
        const fetchedVouchers: any[] = [];
        vouchersSnap.forEach((doc) => {
          fetchedVouchers.push({ id: doc.id, ...doc.data() });
        });
        
        // Add some high-fidelity mocks if empty for design demo
        if (fetchedVouchers.length === 0) {
          fetchedVouchers.push(
            { id: 'v1', name: 'Winter Sanctuary', code: 'MAISON-WINTER-26', value: 15, discountType: 'percentage', description: 'Exclusive winter reduction' },
            { id: 'v2', name: 'Alps Heritage', code: 'ALPS-ELITE', value: 250, discountType: 'fixed', description: 'Premium alpine access' }
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
      <div className="space-y-12">
        <Skeleton className="h-12 w-1/3 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Skeleton className="h-[400px] lg:col-span-2 rounded-[3rem]" />
           <Skeleton className="h-[400px] rounded-[3rem]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-24">
        <EmptyState 
          title="Members Only" 
          description="Please sign in to view your Maison loyalty rewards and vouchers." 
          icon="🔒" 
        />
      </div>
    );
  }

  const currentPoints = loyaltyData?.points || 0;
  const nextTierPoints = 5000;
  const progress = (currentPoints / nextTierPoints) * 100;

  return (
    <div className="space-y-16 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4 font-bold">The Member's Maison</h3>
        <h1 className="text-5xl font-bold text-white italic font-serif tracking-tighter">
          The Art of <span className="text-accent">Loyalty</span>
        </h1>
      </motion.div>

      {/* The Ascent & Points */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Points & Progress (The Ascent) */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-16 items-center">
            {/* The Ascent Visualization */}
            <div className="relative w-24 h-64 flex items-center justify-center">
              {/* Track */}
              <div className="absolute inset-0 w-2 left-1/2 -translate-x-1/2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${progress}%` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute bottom-0 w-full bg-gradient-to-t from-accent/40 via-accent to-white"
                />
              </div>
              
              {/* Tiers */}
              <div className="absolute inset-0 flex flex-col justify-between items-center py-2">
                {[
                  { label: 'ELYSIUM', icon: '✦', color: '#fff' },
                  { label: 'SANCTUARY', icon: '✧', color: '#d4af37' },
                  { label: 'HERITAGE', icon: '•', color: '#666' }
                ].map((tier, i) => (
                  <div key={tier.label} className="relative group/tier flex flex-col items-center">
                     <div className={`w-10 h-10 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-sm mb-2 shadow-2xl transition-all duration-500 ${i === 2 ? 'border-accent shadow-accent/20' : ''}`}>
                       <span className={i === 2 ? 'text-accent' : 'text-gray-500'}>{tier.icon}</span>
                     </div>
                     <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold absolute left-12 whitespace-nowrap opacity-0 group-hover/tier:opacity-100 transition-opacity">
                       {tier.label}
                     </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Points Info */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-8 font-bold">Accumulated Heritage</p>
              <div className="flex items-baseline justify-center md:justify-start gap-4 mb-4">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-8xl font-bold text-white tracking-tighter italic font-serif"
                >
                  {currentPoints}
                </motion.span>
                <span className="text-accent text-sm font-bold uppercase tracking-widest">PTS</span>
              </div>
              <p className="text-gray-400 text-sm font-light max-w-sm leading-relaxed mb-8">
                You are currently in the <span className="text-white font-bold italic">Heritage</span> tier.
                Complete <span className="text-accent font-bold">1,250 pts</span> more to reach <span className="text-white font-bold italic">Sanctuary</span> status.
              </p>
              <div className="flex gap-4">
                <button className="bg-accent text-black px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-accent/10">
                  Redeem Benefits
                </button>
                <button className="border border-white/10 text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                  History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Card */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mb-16 -mr-16 group-hover:bg-accent/10 transition-colors" />
          
          <div>
            <Award className="text-accent mb-8" size={32} />
            <h3 className="text-xl font-bold text-white italic font-serif mb-6">Tier Privileges</h3>
            <ul className="space-y-4">
              {[
                'Priority Sanctuary Access',
                'Complimentary Late Departures',
                'Heritage Welcome Amenities',
                'Member-Only Collection Rates'
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-4 text-xs text-gray-400 group/item">
                  <span className="text-accent font-bold group-hover/item:translate-x-1 transition-transform">✦</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          
          <button className="text-[10px] uppercase tracking-widest font-bold text-accent hover:text-white transition-colors mt-12 flex items-center gap-2">
            View All Privileges <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Vouchers (The Maison Vault) */}
      <section className="pt-12">
        <div className="text-center mb-16">
           <h3 className="text-[10px] uppercase tracking-[0.5em] text-accent mb-4 font-bold">The Maison Vault</h3>
           <h2 className="text-5xl font-bold text-white italic font-serif tracking-tighter italic">Your <span className="text-accent">Vouchers</span></h2>
           <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-bold mt-4">Click to inspect heritage reductions</p>
        </div>

        {vouchers.length > 0 ? (
          <VoucherVault vouchers={vouchers} />
        ) : (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-[3rem] p-24 text-center">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 text-gray-600">✧</div>
             <p className="text-gray-500 font-light text-sm uppercase tracking-widest">The vault is currently unoccupied.</p>
          </div>
        )}
      </section>
    </div>
  );
}
