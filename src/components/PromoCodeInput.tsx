'use client';

import { useState } from 'react';

interface PromoCodeInputProps {
  onApply?: (code: string, discount: number) => void;
}

export function PromoCodeInput({ onApply }: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/vouchers/${code}`);
      if (!res.ok) throw new Error('Invalid code');
      const data = await res.json();
      setDiscount(data.discount_amount || 0);
      setApplied(true);
      setError('');
      onApply?.(code, data.discount_amount || 0);
    } catch {
      setError('Invalid or expired promo code');
      setApplied(false);
    }
  };

  return (
    <form onSubmit={handleApply} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter promo code"
          disabled={applied}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={applied}
          className={`px-6 py-2 rounded-lg font-medium ${
            applied ? 'bg-green-500 text-white cursor-not-allowed' : 'bg-accent text-luxury hover:bg-opacity-90'
          }`}
        >
          {applied ? '✓ Applied' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {applied && discount > 0 && <p className="text-green-600 text-sm">Discount: ${discount}</p>}
    </form>
  );
}
