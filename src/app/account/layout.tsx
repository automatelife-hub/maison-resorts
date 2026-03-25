'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/account/bookings', label: 'Bookings' },
    { href: '/account/profile', label: 'Profile' },
    { href: '/account/loyalty', label: 'Loyalty' },
    { href: '/account/favorites', label: 'Favorites' },
  ];

  return (
    <div className="flex gap-6 max-w-7xl mx-auto px-4 py-12">
      <div className="w-48 flex-shrink-0">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-accent text-luxury font-bold'
                  : 'hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
