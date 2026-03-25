'use client';

import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/EmptyState';

export default function FavoritesPage() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Saved Hotels</h1>
      <EmptyState
        title="No Favorites Yet"
        description="Save your favorite hotels to easily find them later"
        icon="❤️"
        action={{ label: 'Explore Hotels', onClick: () => router.push('/explore') }}
      />
    </div>
  );
}
