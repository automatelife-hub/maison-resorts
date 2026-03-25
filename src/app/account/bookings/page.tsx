import { EmptyState } from '@/components/EmptyState';

export default function BookingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">My Bookings</h1>
      <EmptyState
        title="No Bookings Yet"
        description="Start by searching and booking your next luxury hotel"
        icon="🏨"
      />
    </div>
  );
}
