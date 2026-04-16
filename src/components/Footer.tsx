export default function Footer() {
  return (
    <footer className="bg-luxury text-white pt-24 pb-12 border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white tracking-tighter italic font-serif">
              MAISON <span className="text-accent">Resorts</span>
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed uppercase tracking-widest">
              Facilitating the voyage, honoring the heritage. 
              Discover conscious authenticity in every stay.
            </p>
            <div className="flex gap-4">
               {['TW', 'IG', 'LI'].map(social => (
                 <a key={social} href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] text-gray-500 hover:border-accent hover:text-accent transition-all font-bold">
                   {social}
                 </a>
               ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-8 font-bold">The Collection</h4>
            <ul className="space-y-4 text-[10px] uppercase tracking-widest font-bold">
              <li><a href="/explore" className="text-gray-500 hover:text-white transition-colors">Destinations</a></li>
              <li><a href="/explore" className="text-gray-500 hover:text-white transition-colors">Niche Spots 2026</a></li>
              <li><a href="/explore" className="text-gray-500 hover:text-white transition-colors">Heritage Sanctuaries</a></li>
              <li><a href="/explore" className="text-gray-500 hover:text-white transition-colors">Private Voyages</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-8 font-bold">Voyager's Portal</h4>
            <ul className="space-y-4 text-[10px] uppercase tracking-widest font-bold">
              <li><a href="/account/bookings" className="text-gray-500 hover:text-white transition-colors">My Voyages</a></li>
              <li><a href="/account/loyalty" className="text-gray-500 hover:text-white transition-colors">Loyalty Rewards</a></li>
              <li><a href="/account/favorites" className="text-gray-500 hover:text-white transition-colors">Curated Wishlist</a></li>
              <li><a href="/account/profile" className="text-gray-500 hover:text-white transition-colors">Account Settings</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-accent mb-8 font-bold">Newsletter</h4>
            <p className="text-gray-500 text-[10px] leading-relaxed mb-6 uppercase tracking-widest">Subscribe to receive our latest heritage discoveries.</p>
            <form className="flex gap-2">
               <input 
                 type="email" 
                 placeholder="Your Email" 
                 className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] focus:outline-none focus:border-accent w-full"
               />
               <button className="bg-accent text-luxury px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all">Join</button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[8px] uppercase tracking-[0.4em] text-gray-600">
            &copy; 2026 MAISON RESORTS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[8px] uppercase tracking-[0.2em] font-bold text-gray-600">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Heritage</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
