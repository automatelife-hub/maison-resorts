import { EmptyState } from '@/components/EmptyState';

export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>
      <EmptyState
        title="Profile Settings"
        description="Manage your personal information and preferences"
        icon="👤"
      />
    </div>
  );
}
