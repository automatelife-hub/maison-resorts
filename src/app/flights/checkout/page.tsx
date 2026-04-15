'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PriceDisplay } from '@/components/PriceDisplay';
import { Skeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';

export default function FlightCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { currency } = usePreferences();
  
  const flightOfferId = searchParams.get('flightOfferId');
  const guestsCount = parseInt(searchParams.get('guests') || '1');
  
  const [prebookData, setPrebookData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  
  const [passengers, setPassengers] = useState<any[]>(
    Array.from({ length: guestsCount }, () => ({
      title: 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'M',
      nationality: 'US',
      passportNumber: '',
    }))
  );

  useEffect(() => {
    if (!flightOfferId) {
      setError('Missing flight selection. Please go back and select a voyage.');
      setLoading(false);
      return;
    }

    const fetchPrebook = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/flights/prebook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ flightOfferId }),
        });
        
        if (!response.ok) throw new Error('The selected voyage is no longer available. Please select another flight.');
        const data = await response.json();
        setPrebookData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize booking');
      } finally {
        setLoading(false);
      }
    };

    fetchPrebook();
  }, [flightOfferId]);

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const handleBooking = async () => {
    // Basic validation
    for (const p of passengers) {
      if (!p.firstName || !p.lastName || !p.dateOfBirth || !p.passportNumber) {
        alert('Please fill in all passenger details');
        return;
      }
    }

    try {
      setIsBooking(true);
      const response = await fetch('/api/flights/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prebookId: prebookData.prebookId,
          passengers,
        }),
      });

      if (!response.ok) throw new Error('Booking failed. Please try again.');
      const result = await response.json();
      
      router.push(`/confirmation?bookingId=${result.bookingId}&type=flight`);
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
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <EmptyState title="Booking Error" description={error} icon="⚠️" />
        <button 
          onClick={() => router.back()}
          className="mt-8 mx-auto block bg-luxury text-white px-8 py-3 rounded-xl uppercase tracking-widest text-[10px] font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-luxury italic font-serif">Confirm Your <span className="text-accent">Voyage</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Flight Summary */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-[10px] uppercase tracking-widest text-accent mb-6">Voyage Itinerary</h3>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center p-3">
                 <img src={`https://logo.clearbit.com/${prebookData.airline?.toLowerCase()}.com`} alt={prebookData.airline} className="max-w-full" />
              </div>
              <div>
                <p className="text-xl font-bold text-luxury">{prebookData.airline}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{prebookData.cabinClass} • {prebookData.duration}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center gap-4 py-6 border-t border-gray-50">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Departure</p>
                <p className="text-xl font-bold text-luxury">{prebookData.departureTime}</p>
                <p className="text-xs text-gray-500 font-medium">{prebookData.origin}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full h-[1px] bg-gray-100 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[10px] text-accent italic">DIRECT</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Arrival</p>
                <p className="text-xl font-bold text-luxury">{prebookData.arrivalTime}</p>
                <p className="text-xs text-gray-500 font-medium">{prebookData.destination}</p>
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="space-y-8">
            <h3 className="text-[10px] uppercase tracking-widest text-accent px-1">Passenger Information</h3>
            {passengers.map((passenger, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h4 className="text-sm font-bold text-luxury mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 bg-accent text-luxury rounded-full flex items-center justify-center text-[10px] italic">#{index + 1}</span>
                  Voyager {index + 1}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Title</label>
                    <select 
                      value={passenger.title}
                      onChange={(e) => handlePassengerChange(index, 'title', e.target.value)}
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border-transparent outline-none focus:bg-white focus:border-accent transition-all"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Ms">Ms</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Miss">Miss</option>
                    </select>
                  </div>
                  <div className="hidden md:block" />
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">First Name</label>
                    <input 
                      type="text" 
                      value={passenger.firstName}
                      onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                      placeholder="e.g. Alexander" 
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border-transparent outline-none focus:bg-white focus:border-accent transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Last Name</label>
                    <input 
                      type="text" 
                      value={passenger.lastName}
                      onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                      placeholder="e.g. Sterling" 
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border-transparent outline-none focus:bg-white focus:border-accent transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Date of Birth</label>
                    <input 
                      type="date" 
                      value={passenger.dateOfBirth}
                      onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border-transparent outline-none focus:bg-white focus:border-accent transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Nationality</label>
                    <input 
                      type="text" 
                      value={passenger.nationality}
                      onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                      placeholder="e.g. US" 
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border-transparent outline-none focus:bg-white focus:border-accent transition-all uppercase" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Passport Number</label>
                    <input 
                      type="text" 
                      value={passenger.passportNumber}
                      onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                      placeholder="Enter passport ID" 
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border-transparent outline-none focus:bg-white focus:border-accent transition-all font-mono" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Secure Payment Simulation */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-[10px] uppercase tracking-widest text-accent mb-6">Payment Method</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Card Details</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000" 
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-accent outline-none transition-all font-mono" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">🔒</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">Expiry</label>
                  <input type="text" placeholder="MM / YY" className="w-full px-5 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-accent outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 px-1">CVC</label>
                  <input type="text" placeholder="•••" className="w-full px-5 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-accent outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-luxury text-white rounded-[2.5rem] p-10 shadow-2xl sticky top-24 border border-white/5">
            <h2 className="text-2xl font-bold mb-8 italic font-serif text-accent">Summary</h2>
            
            <div className="space-y-5 mb-8 pb-8 border-b border-white/10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Voyage Total</span>
                <PriceDisplay price={prebookData.selling_rate} currency={prebookData.currency} className="text-white font-medium" />
              </div>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Voyagers</span>
                <span className="text-white">{guestsCount}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-accent font-bold uppercase tracking-widest">
                <span>Taxes & Fees</span>
                <span>Included</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">Final Amount</span>
                <PriceDisplay price={prebookData.selling_rate} currency={prebookData.currency} className="text-3xl font-bold text-accent font-serif" />
              </div>
              
              <button 
                onClick={handleBooking}
                disabled={isBooking}
                className="w-full bg-accent text-luxury font-bold py-5 rounded-2xl hover:bg-white hover:scale-[1.02] transition-all uppercase tracking-widest text-[10px] shadow-xl shadow-accent/10 disabled:opacity-50"
              >
                {isBooking ? 'Finalizing...' : 'Book Voyage'}
              </button>
              
              <p className="text-[9px] text-center text-gray-500 leading-relaxed uppercase tracking-widest">
                Protected by Maison's Secure Booking Guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
