export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: BlogAuthor;
  date: string;
  category: BlogCategory;
  readTime: number;
  coverImage: string;
  featured: boolean;
}

export type BlogCategory =
  | 'Heritage'
  | 'Conscious Luxury'
  | 'Slow Travel'
  | 'Wellness'
  | 'Seasonal'
  | 'Behind the Scenes';

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Heritage',
  'Conscious Luxury',
  'Slow Travel',
  'Wellness',
  'Seasonal',
  'Behind the Scenes',
];

const AUTHORS: Record<string, BlogAuthor> = {
  eloise: {
    name: 'Éloïse Marchand',
    role: 'Editorial Director',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  },
  julian: {
    name: 'Julian Ashworth',
    role: 'Travel Philosopher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  sofia: {
    name: 'Sofia Venturi',
    role: 'Heritage Correspondent',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
  },
  thomas: {
    name: 'Thomas Kael',
    role: 'Wellness Editor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  },
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'the-return-to-silence-heritage-travel-2026',
    title: 'The Return to Silence: Why Heritage Travel Defines 2026',
    excerpt:
      'In an age of perpetual noise, the most radical luxury is silence. We explore how heritage destinations across Europe are becoming sanctuaries for the intentional traveler.',
    content: `
The world has never been louder. Our devices hum with notifications, our cities pulse with urgency, and even our vacations have become performances — curated for feeds, optimized for content. But beneath the noise, a quiet revolution is unfolding.

## The Silence Economy

Heritage travel is no longer about ticking off UNESCO sites. It is about *arriving* — truly arriving — in places where the stones remember centuries and the air carries the weight of stories untold. In 2026, the most discerning travelers are not seeking the newest resort or the most Instagrammable infinity pool. They are seeking silence.

> "Silence is not the absence of sound. It is the presence of everything else." — A Maison Traveler

## Where the Stones Remember

Consider the Albanian Riviera, where turquoise waters lap against cliffs that predate recorded history. Or Hydra Island, where cars are forbidden and the only transit is by donkey or foot. These are not destinations — they are *frequencies*.

The heritage traveler of 2026 understands something fundamental: luxury is not what you add to an experience, but what you remove. Strip away the noise, the rush, the performance, and what remains is the purest form of arrival.

## The New Itinerary

The heritage itinerary looks nothing like the frantic city-hopping of decades past. It is slow, deliberate, and deeply personal:

- **Morning**: Wake without an alarm. Let the light decide your schedule.
- **Midday**: A long meal with local ingredients, prepared by hands that learned from grandmothers.
- **Afternoon**: Walk the ancient paths. Touch the walls. Listen.
- **Evening**: Watch the sun descend behind architecture that has witnessed the rise and fall of empires.

## The Maison Perspective

At Maison, we do not sell destinations. We locate frequencies. Every property in our Heritage Collection has been chosen not for its amenities, but for its resonance — the indefinable quality that makes a place feel like it has been waiting for you.

The return to silence is not a trend. It is a homecoming.
    `.trim(),
    author: AUTHORS.eloise,
    date: '2026-05-15',
    category: 'Heritage',
    readTime: 8,
    coverImage:
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1600',
    featured: true,
  },
  {
    id: '2',
    slug: 'conscious-luxury-beyond-opulence',
    title: 'Beyond Opulence: The Rise of Conscious Luxury',
    excerpt:
      'The golden age of conspicuous consumption is fading. In its place, a new philosophy emerges — one that values intention over excess, craft over cost, and meaning over mere magnificence.',
    content: `
For decades, luxury travel was defined by excess. The largest suite, the most expensive champagne, the most exclusive beach. But the most interesting travelers of our generation are rewriting the rules entirely.

## The Quiet Shift

Conscious luxury is not about spending less — it is about spending *differently*. It is the difference between a hotel that imports marble from Italy and one that was built from the stones of the hillside it sits upon. It is the distinction between a chef who sources globally and one who forages from the forest behind the kitchen.

## Principles of the Conscious Traveler

The conscious luxury movement rests on four pillars:

### 1. Provenance Over Price
Where did this come from? Who made it? What story does it carry? These questions matter more than the price tag.

### 2. Craft Over Scale
A six-room guesthouse run by a family for four generations holds more luxury than a 500-room resort built last year. Scale is the enemy of soul.

### 3. Regeneration Over Extraction
The conscious traveler leaves a place better than they found it. This means supporting properties that regenerate their environments — rewilding, coral restoration, heritage preservation.

### 4. Presence Over Performance
The most radical act of luxury in 2026 is to be somewhere without documenting it. To taste without photographing. To witness without broadcasting.

## The Maison Standard

Every property in the Maison collection is evaluated against these principles. We call it the Heritage Resonance Index — a proprietary assessment that measures not amenities, but authenticity. Not star ratings, but soul.

The future of luxury is not louder. It is deeper.
    `.trim(),
    author: AUTHORS.julian,
    date: '2026-05-10',
    category: 'Conscious Luxury',
    readTime: 7,
    coverImage:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1600',
    featured: false,
  },
  {
    id: '3',
    slug: 'pantelleria-black-pearl-mediterranean',
    title: 'Pantelleria: Inside the Black Pearl of the Mediterranean',
    excerpt:
      'We go behind the scenes at one of our most coveted Heritage Sanctuaries — the volcanic island of Pantelleria, where ancient Dammuso architecture meets a new wave of intentional hospitality.',
    content: `
There is an island between Sicily and Tunisia where the wind has a name. They call it the Scirocco, and it has shaped everything — the architecture, the vineyards, the temperament of the people, and the very stones that form the island's iconic Dammuso dwellings.

## The Architecture of Resistance

Pantelleria's Dammuso houses are a masterclass in climate-responsive design. Built from volcanic black stone, with domed roofs that collect precious rainwater, these structures have sheltered islanders for over a thousand years. Today, the most discerning travelers are choosing these ancient homes over any modern hotel.

> "A Dammuso does not shelter you from the elements. It teaches you to live with them." — Local architect

## The Volcanic Ritual

The island's volcanic origins gift visitors with natural thermal pools, mud baths that have been used since Phoenician times, and the ethereal Mirror of Venus lake — a heart-shaped caldera lake that glows otherworldly at dawn.

Our recommended ritual:

1. **Dawn**: Immerse in the Mirror of Venus at first light
2. **Morning**: Walk the ancient mule paths through caper fields
3. **Midday**: A lunch of sun-dried tomatoes, local capers, and Passito wine
4. **Sunset**: The thermal pools at Cala Gadir, where volcanic springs meet the sea

## Why Maison Chose Pantelleria

Pantelleria embodies everything we believe in at Maison. It cannot be replicated. It cannot be scaled. It can only be experienced — slowly, deliberately, and with the reverence that this ancient land demands.

The Black Pearl does not need to be polished. Its darkness is its beauty.
    `.trim(),
    author: AUTHORS.sofia,
    date: '2026-05-05',
    category: 'Behind the Scenes',
    readTime: 6,
    coverImage:
      'https://images.unsplash.com/photo-1516483642775-7634f18378d3?auto=format&fit=crop&q=80&w=1600',
    featured: false,
  },
  {
    id: '4',
    slug: 'art-of-slow-mode-travel-philosophy',
    title: 'The Art of Slow Mode: A Travel Philosophy',
    excerpt:
      'Speed is the great thief of experience. We make the case for slow mode travel — the intentional practice of moving through the world at the pace of understanding.',
    content: `
We have optimized everything. Our flights are faster, our check-ins are digital, our itineraries are algorithm-generated. And yet, something essential has been lost. The art of *being somewhere* has been sacrificed at the altar of *getting somewhere*.

## What is Slow Mode?

Slow Mode is not a speed — it is a philosophy. It is the practice of matching your internal rhythm to the rhythm of the place you inhabit. In Hydra, that rhythm is the clip of donkey hooves on cobblestone. In Bohinj, it is the glacial patience of alpine water finding its way downhill. In Comporta, it is the whisper of rice stalks in the Alentejo wind.

## The Three Principles

### Depth Over Breadth
Visit one place for seven days instead of seven places in seven days. Know the barista's name. Learn which chair catches the afternoon light. Understand the tide.

### Rhythm Over Schedule
Let the destination set your tempo. Rise with the fishermen or sleep until the church bells wake you. Cancel the afternoon plan if the morning conversation is still unfolding.

### Connection Over Collection
Stop counting countries. Start counting conversations. The richest travel memory is never a monument — it is a moment of genuine human exchange.

## The Slow Mode Manifesto

At Maison, we have embedded Slow Mode into our booking philosophy. Our Sanctuary Planner does not optimize for efficiency — it optimizes for *resonance*. We will never suggest a five-city, ten-day itinerary. We will always suggest one place, deeply.

Because the real luxury is not going everywhere. It is *being* somewhere.
    `.trim(),
    author: AUTHORS.julian,
    date: '2026-04-28',
    category: 'Slow Travel',
    readTime: 5,
    coverImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1600',
    featured: false,
  },
  {
    id: '5',
    slug: 'summer-solstice-arctic-circle-guide',
    title: 'Summer Solstice Above the Arctic Circle: A Seasonal Guide',
    excerpt:
      'When the sun refuses to set, a different kind of magic unfolds. Our guide to experiencing the Midnight Sun across Norway\'s most secluded archipelagos and the forgotten coasts of Arctic Scandinavia.',
    content: `
There are 72 hours each summer when the sun does not set above the Arctic Circle. The sky shifts through an infinite palette — amber, rose, lavender, gold — but never darkness. For those who experience it, time itself seems to dissolve.

## The Midnight Sun Effect

The psychological impact of continuous light is profound. Sleep patterns shift, creativity surges, and the boundary between day and night — that most fundamental human rhythm — simply disappears. It is disorienting, exhilarating, and deeply transformative.

## Where to Experience It

### Træna Archipelago, Norway
Population: 450. Islands: 4. Accessible only by a four-hour ferry from the mainland. Træna is the most remote municipality in Norway, and during the solstice, it becomes a stage for the Midnight Sun as it skims the horizon without dipping below.

### Lofoten Islands, Norway
The dramatic peaks of Lofoten create a natural amphitheater for the solstice light. The contrast between the jagged mountains and the flat, glowing sea at 2 AM is one of the most arresting sights in Europe.

### Gotland, Sweden
While technically below the Arctic Circle, Gotland's position in the Baltic creates exceptionally long summer twilights. The medieval walls of Visby glow amber for hours, and the limestone sea stacks of Fårö become otherworldly silhouettes.

## The Solstice Itinerary

- **Day 1-3**: Arrive in Tromsø. Decompress. Adjust to the light.
- **Day 4-7**: Ferry to Træna. Kayak, forage, and surrender to the rhythm.
- **Day 8-10**: Lofoten. Hike Reinebringen at midnight. Sleep when you are tired, not when it is dark.

## Planning Your Solstice

The window is narrow — mid-June to early July. Maison's Solstice Collection opens for booking each February, and properties fill within days. The Arctic does not wait.

Neither should you.
    `.trim(),
    author: AUTHORS.eloise,
    date: '2026-04-20',
    category: 'Seasonal',
    readTime: 9,
    coverImage:
      'https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&q=80&w=1600',
    featured: false,
  },
  {
    id: '6',
    slug: 'nervous-system-recovery-julian-alps',
    title: 'Nervous System Recovery in the Julian Alps',
    excerpt:
      'Forest bathing, sound healing, and glacial immersion — how Lake Bohinj became the epicenter of a new approach to luxury wellness that treats the nervous system, not just the body.',
    content: `
The wellness industry has a problem. It has become another form of performance — another thing to optimize, track, and post about. But in a glacial valley in the Julian Alps of Slovenia, a different approach is emerging. One that treats the root cause of modern exhaustion: an overstimulated nervous system.

## The Science of Stillness

The autonomic nervous system operates in two modes: sympathetic (fight-or-flight) and parasympathetic (rest-and-digest). Modern life keeps most of us locked in sympathetic mode — perpetually alert, perpetually drained. The Julian Alps offer a natural antidote.

## The Bohinj Protocol

Developed in collaboration with neuroscientists and traditional healers, the Bohinj Protocol is a seven-day nervous system reset:

### Day 1-2: Digital Severance
All devices are surrendered. Not locked away — surrendered. The distinction matters. This is not restriction. It is liberation.

### Day 3-4: Forest Immersion
Guided forest bathing in the ancient beech forests of Triglav National Park. The phytoncides released by the trees have been scientifically shown to reduce cortisol levels by up to 40%.

### Day 5: Glacial Reset
A guided cold immersion protocol in the glacial waters of Lake Bohinj. The shock of 4°C water triggers a powerful vagal nerve response, resetting the nervous system to baseline.

### Day 6-7: Sound Architecture
Sessions in a purpose-built sound chamber where Tibetan singing bowls, crystal bowls, and natural harmonics are used to entrain brainwaves into deep theta states.

## The Results

Guests who complete the Bohinj Protocol report:
- 85% reduction in perceived stress levels
- Improved sleep quality lasting 4-6 weeks post-treatment
- A renewed capacity for presence and deep attention

## Booking the Protocol

The Bohinj Protocol runs from May through October, with a maximum of eight guests per session. It is not a spa treatment. It is a recalibration.

Your nervous system has been carrying the weight of the world. It is time to set it down.
    `.trim(),
    author: AUTHORS.thomas,
    date: '2026-04-12',
    category: 'Wellness',
    readTime: 10,
    coverImage:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1600',
    featured: false,
  },
  {
    id: '7',
    slug: 'comporta-barefoot-luxury-redefined',
    title: 'Comporta: Where Barefoot Luxury Was Born',
    excerpt:
      'Before it had a name, Comporta was living it. We trace the origins of barefoot luxury along the wild Atlantic dunes of Portugal\'s Alentejo coast.',
    content: `
Long before "barefoot luxury" became a hospitality buzzword, the rice farmers and fishermen of Comporta were living its principles. Their homes were simple, their tables were abundant, and their connection to the land was absolute. Now, the world is catching up.

## The Accidental Luxury

Comporta was never designed to be luxurious. It was too remote, too windswept, too agricultural for mainstream tourism. But that very remoteness became its greatest asset. When European tastemakers discovered its 12 kilometers of unbroken white sand beaches in the early 2000s, they found something that no developer could manufacture: authenticity.

## The Comporta Aesthetic

The visual language of Comporta is unmistakable:
- **Materials**: Bleached wood, woven straw, terracotta, raw linen
- **Palette**: Sand, salt white, deep Atlantic blue, rice-stalk green
- **Architecture**: Low-slung, open-aired, designed to dissolve the boundary between inside and outside
- **Dress code**: None. Or rather: bare feet, sun-bleached linen, a straw hat

## A Day in Comporta

**7:00** — Coffee on the terrace. The Atlantic fog is still lifting from the rice paddies.

**9:00** — Bicycle ride to Pego Beach. The sand is so fine it squeaks underfoot.

**12:00** — Lunch at a stilted fishing pier restaurant. Grilled fish, local wine, no menu — the chef serves what the sea provided.

**15:00** — Siesta. The afternoon heat is not fought; it is honored.

**18:00** — A walk through the cork oak forests as the golden hour light filters through the canopy.

**20:30** — Dinner under the stars. Local oysters, Alentejo wines, the sound of the Atlantic just beyond the dunes.

## The Future of Comporta

As development pressure mounts, Comporta faces its greatest test: can it grow without losing its soul? At Maison, we believe the answer lies in the same principles that made it magical — restraint, authenticity, and a deep respect for the land.

Some places are destinations. Comporta is a state of mind.
    `.trim(),
    author: AUTHORS.sofia,
    date: '2026-04-05',
    category: 'Heritage',
    readTime: 7,
    coverImage:
      'https://images.unsplash.com/photo-1590644365607-1c5a519a9a37?auto=format&fit=crop&q=80&w=1600',
    featured: false,
  },
  {
    id: '8',
    slug: 'dolomites-vertical-sanctuary',
    title: 'The Vertical Sanctuary: Finding Luxury in the Dolomites',
    excerpt:
      'At 2,000 meters above sea level, surrounded by vertical limestone walls, a new definition of luxury emerges — one measured not in thread count, but in the distance between you and the world below.',
    content: `
The Dolomites do not welcome you. They confront you. Sheer walls of pale limestone rise thousands of meters, glowing pink at dawn and amber at dusk — a phenomenon the Ladins call *Enrosadira*, the blushing of the mountains. To stand beneath them is to understand your scale in the cosmos.

## The Vertical Philosophy

In a world obsessed with horizontal expansion — larger suites, wider views, longer beaches — the Dolomites offer a vertical alternative. Here, luxury is measured in altitude. In the effort required to reach it. In the silence that exists only above the treeline.

## Cortina d'Ampezzo: The Queen

Cortina has been the epicenter of Alpine elegance since the 1956 Winter Olympics. But beyond the glamour of the Corso Italia, beyond the fur-lined après-ski bars, lies a deeper Cortina — one of ancient Ladin culture, via ferrata courage, and the humbling presence of the Cinque Torri.

## The High-Altitude Ritual

### The Dawn Ascent
Leave the valley at 4 AM. Climb in darkness. Arrive at the ridge as the first light hits the Tofane. There is no spa treatment on earth that compares to watching the sun ignite the Dolomites from above.

### The Rifugio Lunch
Mountain refuges in the Dolomites are not mere shelters — they are culinary institutions. A plate of canederli (bread dumplings) and a glass of local Lagrein at 2,500 meters is a Michelin experience without the pretension.

### The Evening Enrosadira
Every evening, for approximately 20 minutes, the Dolomite walls transform from grey limestone to rose gold. Locals stop what they are doing. Conversations pause. Everyone watches.

## Why Altitude Matters

There is neuroscience behind the mountain high. At altitude, the body produces more red blood cells, increases serotonin production, and shifts the nervous system toward parasympathetic dominance. The mountains are not just beautiful — they are therapeutic.

## The Maison Dolomite Collection

Our curated properties in the Dolomites range from restored Ladin farmhouses to architect-designed lodges perched on impossible ridgelines. Each one shares a common quality: they earn their luxury through elevation.

The higher you go, the less you need.
    `.trim(),
    author: AUTHORS.eloise,
    date: '2026-03-28',
    category: 'Conscious Luxury',
    readTime: 8,
    coverImage:
      'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1600',
    featured: false,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getFeaturedPost(): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.featured);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.category === category);
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(currentSlug);
  if (!current) return BLOG_POSTS.slice(0, limit);

  return BLOG_POSTS.filter(
    (post) => post.slug !== currentSlug && post.category === current.category
  )
    .concat(BLOG_POSTS.filter((post) => post.slug !== currentSlug && post.category !== current.category))
    .slice(0, limit);
}
