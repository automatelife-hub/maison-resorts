import { EmptyState } from '@/components/EmptyState';

export default function ExplorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Explore Destinations</h1>
      <EmptyState
        title="Coming Soon"
        description="Browse featured destinations and collections"
        icon="🌍"
      />
    </div>
  );
}
