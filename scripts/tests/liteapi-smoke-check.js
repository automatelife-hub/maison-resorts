#!/usr/bin/env node

const baseUrl = process.env.LITEAPI_BASE_URL || 'https://api.liteapi.travel/v3.0';
const apiKey = process.env.LITEAPI_SANDBOX_KEY || process.env.LITEAPI_KEY;
const hotelId = process.env.LITEAPI_SMOKE_HOTEL_ID;

async function requestJson(path, init) {
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  const response = await fetch(url, init);
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const requestId = response.headers.get('X-Request-ID') || response.headers.get('x-request-id') || 'n/a';
    throw new Error(`[LiteAPI Smoke] ${path} failed with ${response.status}. Request ID: ${requestId}. Body: ${text.slice(0, 500)}`);
  }

  return payload;
}

async function main() {
  if (!apiKey) {
    console.log('[LiteAPI Smoke] No LiteAPI key configured. Set LITEAPI_SANDBOX_KEY to run a live smoke test.');
    process.exit(0);
  }

  const countries = await requestJson('/data/countries', {
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
  });

  const countriesList = Array.isArray(countries.data) ? countries.data : Array.isArray(countries) ? countries : [];
  if (!countriesList.length) {
    throw new Error('[LiteAPI Smoke] /data/countries did not return a country list.');
  }
  console.log(`[LiteAPI Smoke] countries=${countriesList.length}`);

  if (!hotelId) {
    console.log('[LiteAPI Smoke] Skipping live rates/prebook validation because LITEAPI_SMOKE_HOTEL_ID is not set.');
    process.exit(0);
  }

  const checkin = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  const checkout = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);

  const ratesPayload = await requestJson('/hotels/rates', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hotelIds: [hotelId],
      checkin,
      checkout,
      guestNationality: 'US',
      currency: 'USD',
      occupancies: [{ adults: 2 }],
    }),
  });

  const hotelList = ratesPayload.data?.hotels || ratesPayload.hotels || [];
  const rateHotel = hotelList[0];
  if (!rateHotel) {
    throw new Error('[LiteAPI Smoke] /hotels/rates returned no hotel results for the provided hotel ID.');
  }

  const roomType = rateHotel.roomTypes?.[0];
  const firstRate = roomType?.rates?.[0];
  const offerId = firstRate?.offerId || firstRate?.rateId;
  if (!offerId) {
    throw new Error('[LiteAPI Smoke] /hotels/rates returned a hotel but no offerId/rateId for prebook validation.');
  }

  const prebookPayload = await requestJson('/rates/prebook', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ offerId }),
  });

  if (!prebookPayload.data?.prebookId && !prebookPayload.prebookId) {
    throw new Error('[LiteAPI Smoke] /rates/prebook response did not include a prebookId.');
  }

  console.log('[LiteAPI Smoke] rates and prebook response shapes validated');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
