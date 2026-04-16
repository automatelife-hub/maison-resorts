export interface DealItem {
  id: string;
  name: string;
  location: string;
  image: string;
  originalPrice: number;
  dealPrice: number;
  discount: string;
  vibe: string;
  expiry: string;
}

export const TOP_DEALS: DealItem[] = [
  {
    id: 'd1',
    name: 'The Obsidian Dammuso',
    location: 'Pantelleria, Italy',
    image: 'https://images.unsplash.com/photo-1516483642775-7634f18378d3?auto=format&fit=crop&q=80&w=600',
    originalPrice: 1200,
    dealPrice: 850,
    discount: '30% OFF',
    vibe: 'Quiet Luxury',
    expiry: '48h left'
  },
  {
    id: 'd2',
    name: 'Arctic Design Loft',
    location: 'Træna, Norway',
    image: 'https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&q=80&w=600',
    originalPrice: 950,
    dealPrice: 650,
    discount: 'Special Rate',
    vibe: 'Intentional',
    expiry: 'Limited'
  },
  {
    id: 'd3',
    name: 'Bohinj Glacial Spa',
    location: 'Lake Bohinj, Slovenia',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600',
    originalPrice: 800,
    dealPrice: 520,
    discount: 'Heritage Deal',
    vibe: 'Slow Mode',
    expiry: 'Ends Sunday'
  },
  {
    id: 'd4',
    name: 'Azure Cove Retreat',
    location: 'Ksamil, Albania',
    image: 'https://images.unsplash.com/photo-1580220305417-10c036324200?auto=format&fit=crop&q=80&w=600',
    originalPrice: 600,
    dealPrice: 420,
    discount: '25% OFF',
    vibe: 'Barefoot',
    expiry: 'Flash Deal'
  },
  {
    id: 'd5',
    name: 'Villa Marrakai',
    location: 'Crete, Greece',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600',
    originalPrice: 1500,
    dealPrice: 1100,
    discount: 'Premium',
    vibe: 'Seclusion',
    expiry: 'Verified'
  },
  {
    id: 'd6',
    name: 'The Alchemist Suite',
    location: 'Ghent, Belgium',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600',
    originalPrice: 450,
    dealPrice: 320,
    discount: 'Member Only',
    vibe: 'Heritage',
    expiry: 'Active'
  },
  {
    id: 'd7',
    name: 'Cliffside Sanctuary',
    location: 'Madeira, Portugal',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600',
    originalPrice: 1100,
    dealPrice: 780,
    discount: '30% OFF',
    vibe: 'Atlantic Bloom',
    expiry: '24h left'
  },
  {
    id: 'd8',
    name: 'The Glass House',
    location: 'Lapland, Finland',
    image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=600',
    originalPrice: 1800,
    dealPrice: 1450,
    discount: 'Rare Find',
    vibe: 'Arctic Night',
    expiry: 'Exclusive'
  },
  {
    id: 'd9',
    name: 'Monastery Lodge',
    location: 'Umbria, Italy',
    image: 'https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&q=80&w=600',
    originalPrice: 750,
    dealPrice: 500,
    discount: 'Silence Rate',
    vibe: 'Monastic',
    expiry: 'Limited'
  },
  {
    id: 'd10',
    name: 'Sandstone Villa',
    location: 'Petra, Jordan',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=600',
    originalPrice: 2200,
    dealPrice: 1600,
    discount: '28% OFF',
    vibe: 'Timeless',
    expiry: 'Heritage'
  },
  {
    id: 'd11',
    name: 'Cloud Forest Cabin',
    location: 'Monteverde, Costa Rica',
    image: 'https://images.unsplash.com/photo-1448375235591-18c301440490?auto=format&fit=crop&q=80&w=600',
    originalPrice: 550,
    dealPrice: 380,
    discount: 'Eco Benefit',
    vibe: 'Verdant',
    expiry: 'Open'
  },
  {
    id: 'd12',
    name: 'The Tower Room',
    location: 'Bologna, Italy',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600',
    originalPrice: 650,
    dealPrice: 480,
    discount: 'Vertical Living',
    vibe: 'Medieval',
    expiry: 'Active'
  },
  {
    id: 'd13',
    name: 'Lakeside Pavilion',
    location: 'Lake Como, Italy',
    image: 'https://images.unsplash.com/photo-1531846802986-4942a5c3dd81?auto=format&fit=crop&q=80&w=600',
    originalPrice: 3500,
    dealPrice: 2800,
    discount: '20% OFF',
    vibe: 'Cinematic',
    expiry: 'Limited'
  },
  {
    id: 'd14',
    name: 'Salt Flat Sanctuary',
    location: 'Salar de Uyuni, Bolivia',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?auto=format&fit=crop&q=80&w=600',
    originalPrice: 1200,
    dealPrice: 900,
    discount: 'Starlight Rate',
    vibe: 'Celestial',
    expiry: 'Rare'
  },
  {
    id: 'd15',
    name: 'Highland Croft',
    location: 'Isle of Skye, UK',
    image: 'https://images.unsplash.com/photo-1526481280693-3bfa7561693f?auto=format&fit=crop&q=80&w=600',
    originalPrice: 700,
    dealPrice: 550,
    discount: 'Mist Discount',
    vibe: 'Rugged',
    expiry: 'Verified'
  },
  {
    id: 'd16',
    name: 'Desert Mirage Tent',
    location: 'Wadi Rum, Jordan',
    image: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=600',
    originalPrice: 900,
    dealPrice: 630,
    discount: '30% OFF',
    vibe: 'Nomadic',
    expiry: 'Active'
  },
  {
    id: 'd17',
    name: 'The Foundry Hotel',
    location: 'Asheville, USA',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
    originalPrice: 500,
    dealPrice: 350,
    discount: 'Industrial',
    vibe: 'Crafted',
    expiry: 'Ends Fri'
  },
  {
    id: 'd18',
    name: 'Cherry Blossom Villa',
    location: 'Kyoto, Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600',
    originalPrice: 1600,
    dealPrice: 1280,
    discount: 'Seasonal',
    vibe: 'Zen',
    expiry: 'Last Week'
  },
  {
    id: 'd19',
    name: 'The Lighthouse Keeper',
    location: 'Brest, France',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600',
    originalPrice: 400,
    dealPrice: 280,
    discount: '30% OFF',
    vibe: 'Oceanic',
    expiry: 'Exclusive'
  },
  {
    id: 'd20',
    name: 'Bamboo Sanctuary',
    location: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600',
    originalPrice: 850,
    dealPrice: 600,
    discount: 'Tropics Deal',
    vibe: 'Verdant',
    expiry: 'Active'
  },
  {
    id: 'd21',
    name: 'The Observatory',
    location: 'Atacama, Chile',
    image: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=600',
    originalPrice: 2000,
    dealPrice: 1500,
    discount: 'Night Sky',
    vibe: 'Vast',
    expiry: 'Verified'
  },
  {
    id: 'd22',
    name: 'Fisherman’s Shack',
    location: 'Lofoten, Norway',
    image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&q=80&w=600',
    originalPrice: 600,
    dealPrice: 450,
    discount: '25% OFF',
    vibe: 'Nordic',
    expiry: 'Limited'
  },
  {
    id: 'd23',
    name: 'The Tea House',
    location: 'Ella, Sri Lanka',
    image: 'https://images.unsplash.com/photo-1546768292-fb12f6c92568?auto=format&fit=crop&q=80&w=600',
    originalPrice: 450,
    dealPrice: 320,
    discount: 'Highland',
    vibe: 'Cloudland',
    expiry: 'Active'
  },
  {
    id: 'd24',
    name: 'Ice Hotel Suite',
    location: 'Jukkasjärvi, Sweden',
    image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=600',
    originalPrice: 2200,
    dealPrice: 1800,
    discount: 'Frozen Rate',
    vibe: 'Arctic Circle',
    expiry: 'Rare'
  },
  {
    id: 'd25',
    name: 'The Dune Palace',
    location: 'Sossusvlei, Namibia',
    image: 'https://images.unsplash.com/photo-1440615496174-ee7ecbe8e733?auto=format&fit=crop&q=80&w=600',
    originalPrice: 2500,
    dealPrice: 1950,
    discount: 'Sands Rate',
    vibe: 'Primitive',
    expiry: 'Verified'
  }
];
