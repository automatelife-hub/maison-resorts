import { NextRequest, NextResponse } from 'next/server';
import { FEATURED_DESTINATIONS } from '@/data/destinations';
import { COLLECTION_2026 } from '@/data/collection';

export async function GET(request: NextRequest) {
  try {
    // Map the expanded featured destinations
    const fromDestinations = FEATURED_DESTINATIONS.map((dest) => ({
      id: dest.id,
      name: dest.name,
      location: dest.countryCode,
      image: dest.image,
      vibe: dest.vibe,
      description: dest.description
    }));

    // Map the collection items
    const fromCollection = COLLECTION_2026.map((item) => ({
      id: item.id,
      name: item.name,
      location: item.location,
      image: item.image,
      vibe: item.vibe,
      description: item.description
    }));

    // Combine for a rich, high-density scroll
    const featured = [...fromDestinations, ...fromCollection].sort(() => Math.random() - 0.5);

    return NextResponse.json(featured);
  } catch (error) {
    console.error('Featured Hotels API error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured hotels' }, { status: 500 });
  }
}
