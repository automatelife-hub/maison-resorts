export interface FeaturedDestination {
  id: string;
  name: string;
  countryCode: string;
  description: string;
  vibe: string;
  seoKeywords: string[];
  image: string;
  highlights: string[];
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
    highlights: ['Ksamil Islands', 'Butrint UNESCO Site', 'Boutique Eco-Resorts']
  },
  {
    id: 'pantelleria',
    name: 'Pantelleria, Italy',
    countryCode: 'IT',
    description: 'The "Black Pearl" of the Mediterranean. Volcanic, intensely private, and wind-swept.',
    vibe: 'Quiet Luxury',
    seoKeywords: ['Pantelleria private villas', 'Dammuso luxury stay', 'Armani retreat Italy'],
    image: 'https://images.unsplash.com/photo-1516483642775-7634f18378d3?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Mirror of Venus Lake', 'Ancient Dammuso Stays', 'Volcanic Spa Rituals']
  },
  {
    id: 'traena-archipelago',
    name: 'Træna Archipelago, Norway',
    countryCode: 'NO',
    description: 'A "Coolcation" frontier in the Arctic Circle where the Midnight Sun meets high-design architecture.',
    vibe: 'Intentional Travel',
    seoKeywords: ['Norway Arctic luxury', 'Træna archipelago coolcation', 'Midnight Sun retreat'],
    image: 'https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Arctic Design Lodges', 'Skill-Stacking Workshops', 'Midnight Sun Kayaking']
  },
  {
    id: 'lake-bohinj',
    name: 'Lake Bohinj, Slovenia',
    countryCode: 'SI',
    description: 'The sophisticated, glacial alternative to Lake Bled. A sanctuary for nervous-system recovery.',
    vibe: 'Slow Mode',
    seoKeywords: ['Lake Bohinj wellness', 'Slovenia luxury eco-retreat', 'Alps recovery travel'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
    highlights: ['Glacial Forest Bathing', 'Julian Alps Sound Healing', 'Michelin Farm-to-Table']
  }
];
