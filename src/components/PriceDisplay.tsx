interface PriceDisplayProps {
  price: number;
  currency: string;
  originalPrice?: number;
  className?: string;
}

export function PriceDisplay({ price, currency, originalPrice, className = '' }: PriceDisplayProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  });

  return (
    <div className={className}>
      {originalPrice && (
        <span className="line-through text-gray-400 mr-2">{formatter.format(originalPrice)}</span>
      )}
      <span className="font-bold text-lg">{formatter.format(price)}</span>
    </div>
  );
}
