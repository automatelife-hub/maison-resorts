interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: string;
}

export function StarRating({ rating, maxRating = 5, size = 'md', showLabel = true, color }: StarRatingProps) {
  const sizes = { xs: 'text-[8px]', sm: 'text-[10px]', md: 'text-sm', lg: 'text-base' };
  const stars = Array.from({ length: maxRating }, (_, i) => i < rating);

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5" style={color ? { color } : {}}>
        {stars.map((filled, i) => (
          <span key={i} className={`${sizes[size]} leading-none`}>
            {filled ? '★' : '☆'}
          </span>
        ))}
      </div>
      {showLabel && <span className="text-[10px] ml-1 font-bold text-gray-400">{rating}</span>}
    </div>
  );
}
