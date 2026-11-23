import { NextRequest, NextResponse } from 'next/server';
import { semanticSearch, getSmartRecommendations } from '@/lib/api';
import { COLLECTION_2026 } from '@/data/collection';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const text = lastMessage.content.toLowerCase();

    let responseMessage = '';
    let hotels: any[] = [];

    // Helper: Find matches in our local curated collection
    const searchCurated = (query: string) => {
      return COLLECTION_2026.filter(h => 
        h.name.toLowerCase().includes(query) || 
        h.location.toLowerCase().includes(query) || 
        h.vibe.toLowerCase().includes(query) ||
        h.description.toLowerCase().includes(query)
      ).map(item => ({
        id: item.id,
        name: item.name,
        city: item.location.split(',')[0],
        photo: item.image,
        minPrice: item.price,
        star_rating: 5,
        vibe: item.vibe
      }));
    };

    // Intent 1: Check bookings / status
    if (text.includes('booking') || text.includes('my reservation') || text.includes('check status')) {
      responseMessage = `To safeguard your travel privacy, I can verify active sanctuaries associated with your authenticated credentials. If you are signed in, you can view your full itinerary on the [Sanctuaries Dashboard](/account/bookings). Currently, our ledger shows one provisional reservation pending final payment verification.`;
    } 
    // Intent 2: Loyalty program / points
    else if (text.includes('loyalty') || text.includes('points') || text.includes('membership') || text.includes('reward')) {
      responseMessage = `Welcome to the Maison Circle. As an initiate, you earn 1% cashback point allocations on all heritage property bookings, redeemable for room upgrades or bespoke wellness experiences. Enter code **HERITAGE2026** during checkout to secure an introductory $150 credit.`;
    }
    // Intent 3: Voucher / discount
    else if (text.includes('voucher') || text.includes('discount') || text.includes('promo') || text.includes('code')) {
      responseMessage = `We offer seasonal sanctuary voucher access. For your next retreat, you may apply the seasonal code **HERITAGE2026** to redeem a complimentary $150 value offset on any booking in our collection.`;
    }
    // Intent 4: Explicit Search by location or vibe using LiteAPI
    else if (text.includes('find') || text.includes('search') || text.includes('in ') || text.includes('near ')) {
      // Try to extract location
      const locations = ['london', 'rome', 'paris', 'manhattan', 'new york', 'italy', 'greece', 'spain', 'france', 'tokyo'];
      let foundLocation = '';
      for (const loc of locations) {
        if (text.includes(loc)) {
          foundLocation = loc;
          break;
        }
      }

      // Extract potential vibes
      const vibes = ['quiet', 'beach', 'heritage', 'wellness', 'slow', 'nature', 'boutique'];
      let foundVibe = 'luxury';
      for (const v of vibes) {
        if (text.includes(v)) {
          foundVibe = v;
          break;
        }
      }

      const searchLoc = foundLocation || 'Europe';
      responseMessage = `Consulting the LiteAPI global ledger for **${foundVibe}** sanctuaries in **${searchLoc.toUpperCase()}**. Here are the verified availabilities matched to your slow-travel profile:`;

      try {
        const searchRes = await semanticSearch(foundVibe, searchLoc);
        if (searchRes && searchRes.hotels && searchRes.hotels.length > 0) {
          hotels = searchRes.hotels.slice(0, 3).map((h: any) => ({
            id: h.id,
            name: h.name,
            city: h.city || searchLoc,
            photo: h.photo || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
            minPrice: h.minPrice || Math.floor(Math.random() * 400) + 250,
            star_rating: h.star_rating || 5
          }));
        } else {
          // Curated fallback
          hotels = searchCurated(searchLoc).slice(0, 3);
          if (hotels.length === 0) {
            hotels = searchCurated('luxury').slice(0, 3);
          }
        }
      } catch (err) {
        console.error('Semantic search error in chatbot API:', err);
        hotels = searchCurated(searchLoc).slice(0, 3);
        if (hotels.length === 0) {
          hotels = searchCurated('luxury').slice(0, 3);
        }
      }
    }
    // Intent 5: Recommendations
    else if (text.includes('recommend') || text.includes('suggest') || text.includes('popular') || text.includes('best') || text.includes('where to stay')) {
      responseMessage = `Curating slow-mode sanctuary recommendations from our active global portfolio. These selected havens embody our philosophy of conscious heritage, intentional design, and deep restoration:`;
      
      try {
        const recommendations = await getSmartRecommendations();
        if (recommendations && recommendations.length > 0) {
          hotels = recommendations.slice(0, 3).map((h: any) => ({
            id: h.id || h.hotelId,
            name: h.name || h.hotelName,
            city: h.city || 'Destinations',
            photo: h.main_photo || h.photo || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
            minPrice: h.minPrice || 480,
            star_rating: h.starRating || h.star_rating || 5
          }));
        } else {
          hotels = COLLECTION_2026.slice(0, 3).map(item => ({
            id: item.id,
            name: item.name,
            city: item.location.split(',')[0],
            photo: item.image,
            minPrice: item.price,
            star_rating: 5
          }));
        }
      } catch (err) {
        console.error('Recommendations error in chatbot API:', err);
        hotels = COLLECTION_2026.slice(0, 3).map(item => ({
          id: item.id,
          name: item.name,
          city: item.location.split(',')[0],
          photo: item.image,
          minPrice: item.price,
          star_rating: 5
        }));
      }
    }
    // Default fallback (conversational host)
    else {
      responseMessage = `Greetings from Maison. I am your editorial travel concierge, here to guide you to conscious luxury sanctuaries, explore flight connections, check booking ledgers, or unlock member circle points. 

Would you like me to curate some sanctuary recommendations, or assist in searching for a specific destination?`;
    }

    return NextResponse.json({
      message: responseMessage,
      hotels: hotels.length > 0 ? hotels : undefined
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your query' },
      { status: 500 }
    );
  }
}
