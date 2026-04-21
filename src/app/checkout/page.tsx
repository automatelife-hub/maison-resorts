'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PromoCodeInput } from '@/components/PromoCodeInput';
import { PriceDisplay } from '@/components/PriceDisplay';
import { Skeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { LitePayment } from '@/components/LitePayment';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const rateId = searchParams.get('rateId');
  const hotelId = searchParams.get('hotelId');
  
  const [prebookData, setPrebookData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  
  const [guestDetails, setGuestDetails] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
  });

  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);

  useEffect(() => {
    if (!rateId) {
      setError('Missing rate selection. Please go back and select a room.');
      setLoading(false);
      return;
    }

    const fetchPrebook = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/prebook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rateId }),
        });
        
        if (!response.ok) throw new Error('The selected rate is no longer available. Please select another room.');
        const data = await response.json();
        setPrebookData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize booking');
      } finally {
        setLoading(false);
      }
    };

    fetchPrebook();
  }, [rateId]);

  const handlePaymentSuccess = async (id: string) => {
    setPaymentIntentId(id);
    await handleBooking(id);
  };

  const handleBooking = async (piId?: string) => {
    // If handleBooking was called without a piId, and we don't have one in state, 
    // it means it was called manually (which shouldn't happen now, but for safety)
    const confirmedPiId = piId || paymentIntentId;
    
    if (!guestDetails.name || !guestDetails.email || !guestDetails.phone) {
      alert('Please fill in all guest details before payment');
      return;
    }

    try {
      setIsBooking(true);
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prebookId: prebookData.prebookId,
          guestDetails,
          paymentIntentId: confirmedPiId,
          uid: user?.uid || null,
          hotelName: prebookData.hotelName || 'Maison Retreat',
          checkin: prebookData.checkin,
          checkout: prebookData.checkout,
          sellingRate: prebookData.selling_rate,
          currency: prebookData.currency
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed. Please try again.');
      }
      const result = await response.json();
      
      router.push(`/confirmation?bookingId=${result.bookingId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to complete booking');
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Skeleton className="h-12 w-1/2 mb-8" />
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState title="Booking Error" description={error} icon="⚠️" />
        <button 
          onClick={() => router.back()}
          className="mt-8 mx-auto block bg-luxury text-white px-6 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const finalTotal = appliedVoucher ? prebookData.selling_rate - appliedVoucher.discount : prebookData.selling_rate;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-luxury italic font-serif">Complete Your <span className="text-accent">Reservation</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Hotel Summary */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-accent mb-2">Sanctuary Details</h3>
                <h2 className="text-2xl font-bold text-luxury">{prebookData.hotelName || 'Maison Retreat'}</h2>
                <p className="text-gray-500 text-sm">{prebookData.address}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl text-center min-w-[100px]">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Check-in</p>
                <p className="font-bold text-luxury">{prebookData.checkin}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 py-6 border-t border-gray-50">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Room Type</p>
                <p className="text-luxury font-medium">{prebookData.roomType || 'Deluxe Maison Suite'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Board Basis</p>
                <p className="text-luxury font-medium">{prebookData.boardBasis || 'Room Only'}</p>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-[10px] uppercase tracking-widest text-accent mb-6">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Full Name</label>
                <input
                  type="text"
                  value={guestDetails.name}
                  onChange={(e) => setGuestDetails({...guestDetails, name: e.target.value})}
                  placeholder="E.g. Alexander Sterling"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-accent outline-none transition-all"
                />
                </div>
                <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Email Address</label>
                <input
                  type="email"
                  value={guestDetails.email}
                  onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
                  placeholder="alexander@maison-resorts.com"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-accent outline-none transition-all"
                />
                </div>
                <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Phone Number</label>
                <input
                  type="tel"
                  value={guestDetails.phone}
                  onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-accent outline-none transition-all"
                />              </div>
            </div>
          </div>

          {/* Real Payment Integration */}
          <LitePayment 
            prebookId={prebookData.prebookId}
            amount={finalTotal}
            currency={prebookData.currency}
            onSuccess={handlePaymentSuccess}
          />

          {/* Voucher Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-[10px] uppercase tracking-widest text-accent mb-6">Loyalty & Vouchers</h3>
            <PromoCodeInput
              onApply={(code, discount) => setAppliedVoucher({ code, discount })}
            />
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-luxury text-white rounded-3xl p-8 shadow-xl sticky top-24">
            <h2 className="text-xl font-bold mb-8 italic font-serif">Voyage <span className="text-accent">Summary</span></h2>
            
            <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Base Rate</span>
                <PriceDisplay price={prebookData.selling_rate} currency={prebookData.currency} className="text-white" />
              </div>
              {appliedVoucher && (
                <div className="flex justify-between items-center text-accent">
                  <span className="text-sm">Voucher ({appliedVoucher.code})</span>
                  <span>-${appliedVoucher.discount}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Taxes & Fees</span>
                <span>Included</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end mb-4">
                <span className="text-gray-400 text-sm uppercase tracking-widest">Total</span>
                <PriceDisplay price={finalTotal} currency={prebookData.currency} className="text-2xl font-bold text-accent" />
              </div>
              
              <p className="text-[10px] text-center text-gray-500 leading-relaxed uppercase tracking-tighter">
                Payment is processed securely via our luxury gateway. By paying, you agree to our terms of heritage and the hotel's cancellation policy.
              </p>
            </div>
          </div>
          
          {/* Trust Badge */}
          <div className="text-center p-6 border border-dashed border-gray-200 rounded-3xl">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Secure Reservation</p>
            <div className="flex justify-center gap-4 grayscale opacity-50">
              <span className="text-xs">VISA</span>
              <span className="text-xs">MASTERCARD</span>
              <span className="text-xs">AMEX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
