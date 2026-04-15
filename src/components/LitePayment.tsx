'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ 
  onSuccess, 
  amount, 
  currency 
}: { 
  onSuccess: (paymentIntentId: string) => void;
  amount: number;
  currency: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage && (
        <div className="text-red-500 text-xs mt-2 font-medium bg-red-50 p-3 rounded-xl border border-red-100">
          {errorMessage}
        </div>
      )}
      <button
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-luxury text-accent font-bold py-4 rounded-xl hover:bg-black transition-all uppercase tracking-widest text-[10px] shadow-lg disabled:opacity-50"
      >
        {isProcessing ? 'Verifying...' : `Pay ${currency} ${amount}`}
      </button>
    </form>
  );
}

export function LitePayment({ 
  prebookId, 
  type = 'hotel',
  amount,
  currency,
  onSuccess 
}: { 
  prebookId: string;
  type?: 'hotel' | 'flight';
  amount: number;
  currency: string;
  onSuccess: (id: string) => void;
}) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const initPayment = async () => {
      try {
        const response = await fetch('/api/payments/intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prebookId, type }),
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Payment initialization failed', err);
      }
    };

    if (prebookId) initPayment();
  }, [prebookId, type]);

  if (!clientSecret) {
    return (
      <div className="h-48 flex flex-col items-center justify-center space-y-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] uppercase tracking-widest text-gray-400">Initializing Secure Gateway</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-[10px] uppercase tracking-widest text-accent mb-6">Secure Payment Gateway</h3>
      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
        <CheckoutForm onSuccess={onSuccess} amount={amount} currency={currency} />
      </Elements>
    </div>
  );
}
