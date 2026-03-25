interface BadgeProps {
  label: string;
  variant?: 'refundable' | 'confirmed' | 'cancelled' | 'default';
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const variants = {
    refundable: 'bg-green-100 text-green-800',
    confirmed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800',
  };

  return <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${variants[variant]}`}>{label}</span>;
}
