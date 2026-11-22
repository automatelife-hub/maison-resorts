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
          className="flex-1 px-4 py-2 border border-gray-200 rounded text-xs focus:outline-none focus:border-gray-400 disabled:bg-gray-150"
        />
        <button
          type="submit"
          disabled={applied}
          className={`px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
            applied ? 'bg-green-600 text-white cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {applied ? 'Applied' : 'Apply'}
        </button>
      </div>
      {error && <p className="text-red-650 text-xs">{error}</p>}
      {applied && discount > 0 && <p className="text-green-655 text-xs">Discount of ${discount} applied</p>}
    </form>
  );
}
