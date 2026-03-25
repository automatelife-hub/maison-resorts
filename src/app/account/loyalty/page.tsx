import { EmptyState } from '@/components/EmptyState';

export default function LoyaltyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Loyalty Program</h1>
      <EmptyState
        title="Earn Points"
        description="Book hotels to earn loyalty points and unlock exclusive benefits"
        icon="⭐"
      />
    </div>
  );
}
