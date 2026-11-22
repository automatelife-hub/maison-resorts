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
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Skeleton className="h-8 w-1/2 mb-8 bg-gray-100 rounded" />
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <Skeleton className="h-32 w-full bg-gray-100 rounded" />
            <Skeleton className="h-48 w-full bg-gray-100 rounded" />
          </div>
          <Skeleton className="h-64 w-full bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <EmptyState title="Booking Error" description={error} icon="⚠️" />
        <button 
          onClick={() => router.back()}
          className="mt-6 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const finalTotal = appliedVoucher ? prebookData.selling_rate - appliedVoucher.discount : prebookData.selling_rate;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-serif text-gray-900 font-normal mb-8">Complete Your Reservation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Hotel Summary */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Hotel Details</h3>
                <h2 className="text-xl font-semibold text-gray-900">{prebookData.hotelName || 'Property'}</h2>
                <p className="text-xs text-gray-500 mt-1">{prebookData.address}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center min-w-[100px] shrink-0">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Check-in</p>
                <p className="text-sm font-semibold text-gray-800">{prebookData.checkin}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-150">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Room Type</p>
                <p className="text-xs font-semibold text-gray-800">{prebookData.roomType || 'Standard Suite'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Board Basis</p>
                <p className="text-xs font-semibold text-gray-800">{prebookData.boardBasis || 'Room Only'}</p>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xs uppercase tracking-wider text-gray-450 font-bold mb-4">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-1">Full Name</label>
                <input
                  type="text"
                  value={guestDetails.name}
                  onChange={(e) => setGuestDetails({...guestDetails, name: e.target.value})}
                  placeholder="Alexander Sterling"
                  className="w-full px-3 py-2 rounded text-xs bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-1">Email Address</label>
                <input
                  type="email"
                  value={guestDetails.email}
                  onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
                  placeholder="alexander@example.com"
                  className="w-full px-3 py-2 rounded text-xs bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-1">Phone Number</label>
                <input
                  type="tel"
                  value={guestDetails.phone}
                  onChange={(e) => setGuestDetails({...guestDetails, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 rounded text-xs bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment integration */}
          <LitePayment 
            prebookId={prebookData.prebookId}
            amount={finalTotal}
            currency={prebookData.currency}
            onSuccess={handlePaymentSuccess}
          />

          {/* Voucher Section */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xs uppercase tracking-wider text-gray-450 font-bold mb-4">Loyalty & Vouchers</h3>
            <PromoCodeInput
              onApply={(code, discount) => setAppliedVoucher({ code, discount })}
            />
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm sticky top-24">
            <h2 className="text-base font-semibold text-gray-900 mb-6">Reservation Summary</h2>
            
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Base Rate</span>
                <PriceDisplay price={prebookData.selling_rate} currency={prebookData.currency} className="text-gray-900 font-semibold" />
              </div>
              {appliedVoucher && (
                <div className="flex justify-between items-center text-xs text-green-600 font-semibold">
                  <span>Voucher ({appliedVoucher.code})</span>
                  <span>-${appliedVoucher.discount}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs text-gray-550">
                <span className="text-gray-500">Taxes & Fees</span>
                <span>Included</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total</span>
                <PriceDisplay price={finalTotal} currency={prebookData.currency} className="text-xl font-bold text-gray-950" />
              </div>
              
              <p className="text-[10px] text-center text-gray-400 leading-relaxed uppercase">
                Payment is processed securely. By confirming your booking, you agree to our terms of service and cancellation policies.
              </p>
            </div>
          </div>
          
          {/* Trust Badge */}
          <div className="text-center p-4 border border-dashed border-gray-200 rounded">
            <p className="text-[10px] uppercase tracking-wider text-gray-450 mb-2 font-bold">Secure Checkout</p>
            <div className="flex justify-center gap-4 text-[10px] text-gray-400 font-bold font-mono">
              <span>VISA</span>
              <span>MASTERCARD</span>
              <span>AMEX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
