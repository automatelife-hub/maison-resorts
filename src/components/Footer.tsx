export default function Footer() {
  return (
    <footer className="bg-luxury text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4 text-accent">Maison</h3>
          <p className="text-gray-400">Premium hotel booking platform for discerning travelers.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/explore" className="hover:text-accent">Destinations</a></li>
            <li><a href="/explore" className="hover:text-accent">Collections</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/account/bookings" className="hover:text-accent">Bookings</a></li>
            <li><a href="/account/loyalty" className="hover:text-accent">Loyalty</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-accent">Privacy</a></li>
            <li><a href="#" className="hover:text-accent">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
        <p>&copy; 2026 Maison. All rights reserved.</p>
      </div>
    </footer>
  );
}
