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
}

export const FEATURED_DESTINATIONS: FeaturedDestination[] = [
  {
    id: 'albanian-riviera',
    name: 'Albanian Riviera',
    countryCode: 'AL',
    description: 'The "New Riviera" of Europe, where untouched turquoise waters meet rugged Mediterranean cliffs.',
    vibe: 'Barefoot Luxury',
    seoKeywords: ['Albanian Riviera luxury', 'Ksamil hidden gems', 'unvisited Europe coastline'],
    image: 'https://images.unsplash.com/photo-1580220305417-10c036324200?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Ksamil Islands', 'Butrint UNESCO Site', 'Boutique Eco-Resorts'],
    latitude: 39.8131,
    longitude: 20.0051
  },
  {
    id: 'pantelleria',
    name: 'Pantelleria, Italy',
    countryCode: 'IT',
    description: 'The "Black Pearl" of the Mediterranean. Volcanic, intensely private, and wind-swept.',
    vibe: 'Quiet Luxury',
    seoKeywords: ['Pantelleria private villas', 'Dammuso luxury stay', 'Armani retreat Italy'],
    image: 'https://images.unsplash.com/photo-1516483642775-7634f18378d3?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Mirror of Venus Lake', 'Ancient Dammuso Stays', 'Volcanic Spa Rituals'],
    latitude: 36.7781,
    longitude: 11.9891
  },
  {
    id: 'traena-archipelago',
    name: 'Træna Archipelago, Norway',
    countryCode: 'NO',
    description: 'A "Coolcation" frontier in the Arctic Circle where the Midnight Sun meets high-design architecture.',
    vibe: 'Intentional Travel',
    seoKeywords: ['Norway Arctic luxury', 'Træna archipelago coolcation', 'Midnight Sun retreat'],
    image: 'https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Arctic Design Lodges', 'Skill-Stacking Workshops', 'Midnight Sun Kayaking'],
    latitude: 66.5011,
    longitude: 12.0981
  },
  {
    id: 'lake-bohinj',
    name: 'Lake Bohinj, Slovenia',
    countryCode: 'SI',
    description: 'The sophisticated, glacial alternative to Lake Bled. A sanctuary for nervous-system recovery.',
    vibe: 'Slow Mode',
    seoKeywords: ['Lake Bohinj wellness', 'Slovenia luxury eco-retreat', 'Alps recovery travel'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Glacial Forest Bathing', 'Julian Alps Sound Healing', 'Michelin Farm-to-Table'],
    latitude: 46.2821,
    longitude: 13.8851
  },
  {
    id: 'comporta',
    name: 'Comporta, Portugal',
    countryCode: 'PT',
    description: 'The Hamptons of Europe. Endless rice fields meet wild Atlantic dunes in a masterclass of understated chic.',
    vibe: 'Barefoot Luxury',
    seoKeywords: ['Comporta luxury villas', 'Portugal rice field retreat', 'Alentejo coast'],
    image: 'https://images.unsplash.com/photo-1590644365607-1c5a519a9a37?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Pego Beach', 'Designer Cabanas', 'Stilted Fishing Piers'],
    latitude: 38.3831,
    longitude: -8.7831
  },
  {
    id: 'val-disere',
    name: 'Val d\'Isere, France',
    countryCode: 'FR',
    description: 'High-altitude heritage where the Savoir-Vivre of the French Alps reaches its zenith.',
    vibe: 'Quiet Luxury',
    seoKeywords: ['Val dIsere private chalets', 'French Alps elite skiing', 'High-altitude wellness'],
    image: 'https://images.unsplash.com/photo-1551882547-ff43c63be532?auto=format&fit=crop&q=80&w=1200',
    highlights: ['L\'Iserane Glacier', 'Michelin Star Dining', 'Private Heli-Skiing'],
    latitude: 45.4481,
    longitude: 6.9801
  },
  {
    id: 'hydra-island',
    name: 'Hydra Island, Greece',
    countryCode: 'GR',
    description: 'The car-free sanctuary of the Saronic Gulf. A sensory return to stone, donkey-paths, and deep silence.',
    vibe: 'Slow Mode',
    seoKeywords: ['Hydra car-free island', 'Greek artist retreat', 'Aegean silence'],
    image: 'https://images.unsplash.com/photo-1601581875309-fad3c125d84d?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Donkey Transit', 'Amphitheater Port', 'Monastery Hikes'],
    latitude: 37.3501,
    longitude: 23.4661
  },
  {
    id: 'high-tatra',
    name: 'High Tatras, Slovakia',
    countryCode: 'SK',
    description: 'The "Lilliput Alps" — rugged, dramatic peaks and deep pine forests for the intentional explorer.',
    vibe: 'Intentional Travel',
    seoKeywords: ['High Tatras luxury spa', 'Slovakia mountain retreat', 'Central Europe wilderness'],
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Tatra Ice Dome', 'Grand Hotel Heritage', 'Bear Watching Safaris'],
    latitude: 49.1661,
    longitude: 20.1331
  },
  {
    id: 'gotland',
    name: 'Gotland, Sweden',
    countryCode: 'SE',
    description: 'A Viking-age island of limestone, roses, and hauntingly beautiful medieval ruins.',
    vibe: 'Quiet Luxury',
    seoKeywords: ['Gotland design retreat', 'Visby medieval luxury', 'Baltic Sea heritage'],
    image: 'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Visby UNESCO Wall', 'Fårö Limestone Stacks', 'Scandinavian Minimalism'],
    latitude: 57.5001,
    longitude: 18.5001
  },
  {
    id: 'menorca',
    name: 'Menorca, Spain',
    countryCode: 'ES',
    description: 'The gentle sister of Mallorca. A UNESCO Biosphere Reserve where the turquoise coves are protected by silence.',
    vibe: 'Slow Mode',
    seoKeywords: ['Menorca boutique agroturismo', 'Spain slow travel', 'Balearic coves'],
    image: 'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Cala Macarella', 'Talayotic Ruins', 'Organic Gin Distilleries'],
    latitude: 39.9491,
    longitude: 4.1101
  },
  {
    id: 'lofoten',
    name: 'Lofoten, Norway',
    countryCode: 'NO',
    description: 'Where the mountains meet the sea in a dramatic display of Arctic majesty and traditional fishing heritage.',
    vibe: 'Barefoot Luxury',
    seoKeywords: ['Lofoten Rorbu luxury', 'Norway Northern Lights', 'Arctic surfing'],
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Reinebringen View', 'Luxury Rorbu Stays', 'Midnight Sun Golf'],
    latitude: 68.1661,
    longitude: 13.7501
  },
  {
    id: 'cortina',
    name: 'Cortina d\'Ampezzo, Italy',
    countryCode: 'IT',
    description: 'The "Queen of the Dolomites." A century-old sanctuary of Italian style and vertical limestone drama.',
    vibe: 'Quiet Luxury',
    seoKeywords: ['Dolomites elite ski', 'Cortina luxury wellness', 'Italian mountain style'],
    image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Cinque Torri', 'Corso Italia Glamour', 'Via Ferrata Climbing'],
    latitude: 46.5401,
    longitude: 12.1331
  }
];
