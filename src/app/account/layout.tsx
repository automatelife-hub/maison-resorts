import { AccountSidebar } from '@/components/AccountSidebar';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white min-h-screen text-gray-850">
      <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto px-6 py-12">
        <AccountSidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
