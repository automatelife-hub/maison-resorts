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
        <div className="text-red-650 text-xs mt-2 font-medium bg-red-50 p-3 rounded border border-red-100">
          {errorMessage}
        </div>
      )}
      <button
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
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
      <div className="h-40 flex flex-col items-center justify-center space-y-3 bg-gray-50 rounded border border-dashed border-gray-200">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Initializing Secure Gateway</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-xs uppercase tracking-wider text-gray-450 font-bold mb-4">Payment Method</h3>
      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
        <CheckoutForm onSuccess={onSuccess} amount={amount} currency={currency} />
      </Elements>
    </div>
  );
}
