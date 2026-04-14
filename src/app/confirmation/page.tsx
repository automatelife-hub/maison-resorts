'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <div className="mb-12">
        <div className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
          ✓
        </div>
        <h1 className="text-5xl font-bold text-luxury mb-4 italic font-serif">Bon <span className="text-accent">Voyage</span></h1>
        <p className="text-xl text-gray-600 max-w-lg mx-auto">
          Your reservation has been confirmed. Your sanctuary awaits.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 mb-12">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Reservation Reference</p>
        <p className="text-3xl font-mono font-bold text-luxury tracking-widest">{bookingId || 'MAISON-CONF-2026'}</p>
        
        <div className="mt-12 pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-center gap-8 text-sm">
          <div className="text-center">
            <p className="font-bold text-luxury mb-1 italic font-serif">Email Sent</p>
            <p className="text-gray-500">Your itinerary is in your inbox.</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-luxury mb-1 italic font-serif">Member Rewards</p>
            <p className="text-gray-500">Points have been added to your account.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          href="/account/bookings" 
          className="bg-luxury text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all"
        >
          View Itinerary
        </Link>
        <Link 
          href="/" 
          className="bg-white text-luxury border border-gray-200 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
