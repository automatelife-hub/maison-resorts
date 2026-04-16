interface BadgeProps {
  children: React.ReactNode;
  variant?: 'refundable' | 'confirmed' | 'cancelled' | 'default' | 'success' | 'warning';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    refundable: 'bg-green-100 text-green-800',
    confirmed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    default: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${variants[variant as keyof typeof variants]}`}>
      {children}
    </span>
  );
}
