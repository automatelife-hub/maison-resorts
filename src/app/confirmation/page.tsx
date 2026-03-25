'use client';

import Link from 'next/link';
import { Badge } from '@/components/Badge';

export default function ConfirmationPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="text-6xl mb-4">✓</div>
      <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
      <p className="text-gray-600 mb-8">Your reservation is confirmed. A confirmation email has been sent.</p>

      <div className="bg-white rounded-lg shadow p-8 mb-8 text-left">
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p className="text-gray-600 mb-1">Confirmation Number</p>
            <p className="text-2xl font-bold">BOK-2026-12345</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Status</p>
            <Badge label="Confirmed" variant="confirmed" />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-bold mb-4">Booking Details</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-semibold">Hotel:</span> Grand Luxury Hotel</p>
            <p><span className="font-semibold">Check-in:</span> March 20, 2026</p>
            <p><span className="font-semibold">Check-out:</span> March 25, 2026</p>
            <p><span className="font-semibold">Total Amount:</span> $1,200 USD</p>
            <p><span className="font-semibold">Loyalty Points Earned:</span> 1,200 points</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link href="/account/bookings" className="btn-primary block w-full text-center">
          View My Bookings
        </Link>
        <Link href="/" className="block w-full px-4 py-2 border rounded-lg hover:bg-gray-50">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
