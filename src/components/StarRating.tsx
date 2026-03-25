interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function StarRating({ rating, maxRating = 5, size = 'md', showLabel = true }: StarRatingProps) {
  const sizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const stars = Array.from({ length: maxRating }, (_, i) => i < rating);

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {stars.map((filled, i) => (
          <span key={i} className={sizes[size]}>
            {filled ? '⭐' : '☆'}
          </span>
        ))}
      </div>
      {showLabel && <span className="text-sm ml-2">{rating}/{maxRating}</span>}
    </div>
  );
}
