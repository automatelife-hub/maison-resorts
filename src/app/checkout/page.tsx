'use client';

import { useState } from 'react';
import { PromoCodeInput } from '@/components/PromoCodeInput';
import { PriceDisplay } from '@/components/PriceDisplay';

export default function CheckoutPage() {
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);

  const mockTotal = 1200;
  const finalTotal = appliedVoucher ? mockTotal - appliedVoucher.discount : mockTotal;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Confirm Your Booking</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <div className="space-y-4 text-gray-700">
              <p><span className="font-semibold">Hotel:</span> Grand Luxury Hotel</p>
              <p><span className="font-semibold">Check-in:</span> March 20, 2026</p>
              <p><span className="font-semibold">Check-out:</span> March 25, 2026</p>
              <p><span className="font-semibold">Guests:</span> 2 adults</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Guest Information</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border rounded-lg" />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-2 border rounded-lg" />
              <input type="tel" placeholder="Phone Number" className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Promo Code</h2>
            <PromoCodeInput
              onApply={(code, discount) => setAppliedVoucher({ code, discount })}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-lg font-bold mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6 pb-6 border-b">
            <div className="flex justify-between">
              <span>5 nights × $240</span>
              <PriceDisplay price={1200} currency="USD" />
            </div>
            {appliedVoucher && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedVoucher.code})</span>
                <span>-${appliedVoucher.discount}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <PriceDisplay price={finalTotal} currency="USD" />
            </div>
            <button className="w-full bg-accent text-luxury font-bold py-3 rounded-lg hover:bg-opacity-90">
              Complete Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
