export interface FeaturedDestination {
  id: string;
  name: string;
  countryCode: string;
  description: string;
  vibe: string;
  seoKeywords: string[];
  image: string;
  highlights: string[];
  latitude: number;
  longitude: number;
  minPrice: number;
  priceTier: 'Value' | 'Premium' | 'Elite';
}

export const FEATURED_DESTINATIONS: FeaturedDestination[] = [
  {
    id: 'albanian-riviera',
    name: 'Albanian Riviera',
    countryCode: 'AL',
    description: 'A stunning stretch of Mediterranean coastline featuring quiet sandy beaches and historic seaside villages.',
    vibe: 'Beachfront',
    seoKeywords: ['Albanian Riviera hotels', 'Ksamil beach resorts', 'Mediterranean coastline'],
    image: 'https://images.unsplash.com/photo-1580220305417-10c036324200?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Ksamil Islands', 'Butrint UNESCO Site', 'Boutique Eco-Resorts'],
    latitude: 39.8131,
    longitude: 20.0051,
    minPrice: 120,
    priceTier: 'Value'
  },
  {
    id: 'pantelleria',
    name: 'Pantelleria, Italy',
    countryCode: 'IT',
    description: 'A beautiful volcanic island off the coast of Sicily, famous for private stone villas and thermal springs.',
    vibe: 'Luxury Boutique',
    seoKeywords: ['Pantelleria hotels', 'private villas Sicily', 'volcanic island stay'],
    image: 'https://images.unsplash.com/photo-1516483642775-7634f18378d3?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Mirror of Venus Lake', 'Ancient Dammuso Stays', 'Volcanic Spa Rituals'],
    latitude: 36.7781,
    longitude: 11.9891,
    minPrice: 480,
    priceTier: 'Premium'
  },
  {
    id: 'traena-archipelago',
    name: 'Træna Archipelago, Norway',
    countryCode: 'NO',
    description: 'A beautiful group of islands in the Arctic Circle, featuring scenic coastal trails and local fishing heritage.',
    vibe: 'Arctic & Winter',
    seoKeywords: ['Norway Arctic hotels', 'Træna archipelago stay', 'Midnight Sun cabins'],
    image: 'https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Arctic Design Lodges', 'Skill-Stacking Workshops', 'Midnight Sun Kayaking'],
    latitude: 66.5011,
    longitude: 12.0981,
    minPrice: 280,
    priceTier: 'Premium'
  },
  {
    id: 'lake-bohinj',
    name: 'Lake Bohinj, Slovenia',
    countryCode: 'SI',
    description: 'A peaceful alpine retreat next to Slovenia\'s largest glacier lake, perfect for outdoor recreation and relaxation.',
    vibe: 'Country & Nature',
    seoKeywords: ['Lake Bohinj hotels', 'Slovenia eco-resorts', 'Alps vacation'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Glacial Forest Bathing', 'Julian Alps Sound Healing', 'Michelin Farm-to-Table'],
    latitude: 46.2821,
    longitude: 13.8851,
    minPrice: 180,
    priceTier: 'Value'
  },
  {
    id: 'comporta',
    name: 'Comporta, Portugal',
    countryCode: 'PT',
    description: 'A scenic coast south of Lisbon, where pine forests and sand dunes meet miles of sandy beaches.',
    vibe: 'Beachfront',
    seoKeywords: ['Comporta luxury hotels', 'Portugal beach resorts', 'Alentejo coast stays'],
    image: 'https://images.unsplash.com/photo-1590644365607-1c5a519a9a37?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Pego Beach', 'Designer Cabanas', 'Stilted Fishing Piers'],
    latitude: 38.3831,
    longitude: -8.7831,
    minPrice: 380,
    priceTier: 'Premium'
  },
  {
    id: 'val-disere',
    name: 'Val d\'Isere, France',
    countryCode: 'FR',
    description: 'One of the world\'s premier ski resorts, offering historic village charm, great slopes, and mountain lodging.',
    vibe: 'Mountain & Ski',
    seoKeywords: ['Val dIsere ski chalets', 'French Alps resorts', 'mountain wellness'],
    image: 'https://images.unsplash.com/photo-1551882547-ff43c63be532?auto=format&fit=crop&q=80&w=1200',
    highlights: ['L\'Iserane Glacier', 'Michelin Star Dining', 'Private Heli-Skiing'],
    latitude: 45.4481,
    longitude: 6.9801,
    minPrice: 650,
    priceTier: 'Elite'
  },
  {
    id: 'hydra-island',
    name: 'Hydra Island, Greece',
    countryCode: 'GR',
    description: 'A beautiful car-free Greek island with a historic harbor, traditional stone architecture, and clear waters.',
    vibe: 'Historic & Coast',
    seoKeywords: ['Hydra island hotels', 'car-free Greece vacation', 'Aegean beach stays'],
    image: 'https://images.unsplash.com/photo-1601581875309-fad3c125d84d?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Donkey Transit', 'Amphitheater Port', 'Monastery Hikes'],
    latitude: 37.3501,
    longitude: 23.4661,
    minPrice: 220,
    priceTier: 'Value'
  },
  {
    id: 'high-tatra',
    name: 'High Tatras, Slovakia',
    countryCode: 'SK',
    description: 'A scenic mountain range in Slovakia with dramatic peaks, hiking trails, and historic resort hotels.',
    vibe: 'Alpine',
    seoKeywords: ['High Tatras hotels', 'Slovakia mountain spas', 'Tatra mountains stay'],
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Tatra Ice Dome', 'Grand Hotel Heritage', 'Bear Watching Safaris'],
    latitude: 49.1661,
    longitude: 20.1331,
    minPrice: 195,
    priceTier: 'Value'
  },
  {
    id: 'gotland',
    name: 'Gotland, Sweden',
    countryCode: 'SE',
    description: 'A historic Baltic Sea island famous for its medieval town Visby, sandy beaches, and scenic countryside.',
    vibe: 'Historic & Coast',
    seoKeywords: ['Gotland design hotels', 'Visby accommodation', 'Baltic Sea island'],
    image: 'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Visby UNESCO Wall', 'Fårö Limestone Stacks', 'Scandinavian Minimalism'],
    latitude: 57.5001,
    longitude: 18.5001,
    minPrice: 320,
    priceTier: 'Premium'
  },
  {
    id: 'menorca',
    name: 'Menorca, Spain',
    countryCode: 'ES',
    description: 'A tranquil Balearic island known for its beautiful sheltered sandy coves and biosphere reserves.',
    vibe: 'Beachfront',
    seoKeywords: ['Menorca beach hotels', 'Balearic island stay', 'Menorca eco-tourism'],
    image: 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Cala Macarella', 'Talayotic Ruins', 'Organic Gin Distilleries'],
    latitude: 39.9491,
    longitude: 4.1101,
    minPrice: 240,
    priceTier: 'Value'
  },
  {
    id: 'lofoten',
    name: 'Lofoten, Norway',
    countryCode: 'NO',
    description: 'A dramatic archipelago in Norway known for its majestic peaks, red fishing cabins, and Northern Lights.',
    vibe: 'Arctic & Winter',
    seoKeywords: ['Lofoten cabins', 'Norway Northern Lights hotels', 'Arctic Norway stay'],
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Reinebringen View', 'Luxury Rorbu Stays', 'Midnight Sun Golf'],
    latitude: 68.1661,
    longitude: 13.7501,
    minPrice: 420,
    priceTier: 'Premium'
  },
  {
    id: 'cortina',
    name: 'Cortina d\'Ampezzo, Italy',
    countryCode: 'IT',
    description: 'A famous Dolomite resort town offering spectacular mountain scenery, world-class skiing, and Italian dining.',
    vibe: 'Alpine',
    seoKeywords: ['Dolomites ski hotels', 'Cortina dAmpezzo luxury resort', 'Italian Alps skiing'],
    image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Cinque Torri', 'Corso Italia Glamour', 'Via Ferrata Climbing'],
    latitude: 46.5401,
    longitude: 12.1331,
    minPrice: 720,
    priceTier: 'Elite'
  }
];
