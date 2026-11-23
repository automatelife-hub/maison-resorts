'use client';

import React from 'react';
import { PriceDisplay } from './PriceDisplay';

interface Voucher {
  id: string;
  name: string;
  code: string;
  value: number;
  discountType: string;
  description: string;
}

interface VoucherVaultProps {
  vouchers: Voucher[];
}

export function VoucherVault({ vouchers }: VoucherVaultProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
      {vouchers.map((v) => (
        <div key={v.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Maison Code</p>
              <p className="text-sm text-gray-800 font-mono font-bold">{v.code}</p>
            </div>
            <span className="bg-gray-100 text-gray-800 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">
              Active
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-serif text-gray-900 font-normal mb-1">
              {v.name}
            </h3>
            <p className="text-xs text-gray-500 mb-4">{v.description}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">
                {v.discountType === 'percentage' ? `${v.value}%` : <PriceDisplay price={v.value} currency="USD" />}
              </span>
              <span className="text-xs text-gray-400 uppercase font-semibold">Off</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-150 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <span>2026 Collection</span>
            <span>Verified Voucher</span>
          </div>
        </div>
      ))}
    </div>
  );
}
