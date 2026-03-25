interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = 'h-12 w-full', count = 1 }: SkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${className} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-size-200 animate-pulse rounded`} />
      ))}
    </div>
  );
}
