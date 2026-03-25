'use client';

interface SentimentCategory {
  label: string;
  score: number;
}

interface SentimentDisplayProps {
  categories: { [key: string]: number };
}

export function SentimentDisplay({ categories }: SentimentDisplayProps) {
  const categoryMap: SentimentCategory[] = [
    { label: 'Cleanliness', score: categories.cleanliness || 0 },
    { label: 'Service', score: categories.service || 0 },
    { label: 'Location', score: categories.location || 0 },
    { label: 'Room Quality', score: categories.room_quality || 0 },
    { label: 'Value', score: categories.value || 0 },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Guest Sentiment</h3>
      {categoryMap.map((cat) => (
        <div key={cat.label}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{cat.label}</span>
            <span className="text-sm text-gray-600">{(cat.score * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full"
              style={{ width: `${cat.score * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
