import { AccountSidebar } from '@/components/AccountSidebar';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#050505] min-h-screen">
      <div className="flex gap-12 max-w-7xl mx-auto px-6 py-24">
        <AccountSidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
