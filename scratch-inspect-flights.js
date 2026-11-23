const LITEAPI_KEY = 'REDACTED_LITEAPI_KEY';

async function run() {
  const headers = {
    'X-API-Key': LITEAPI_KEY,
    'accept': 'application/json',
    'content-type': 'application/json'
  };

  const body = {
    legs: [
      {
        origin: 'JFK',
        destination: 'LHR',
        date: '2026-07-15'
      }
    ],
    adults: 1,
    cabinClass: 'ECONOMY',
    currency: 'USD'
  };

  try {
    const res = await fetch('https://api.liteapi.travel/v3.0/flights/rates', {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    const json = await res.json();
    const resultObj = json.data?.['0'];
    if (resultObj) {
      console.log('journeys length:', resultObj.journeys?.length);
      if (resultObj.journeys?.length > 0) {
        const journey = resultObj.journeys[0];
        console.log('journey keys:', Object.keys(journey));
        console.log('journey.offers length:', journey.offers?.length);
        if (journey.offers?.length > 0) {
          console.log('journey.offers[0] keys:', Object.keys(journey.offers[0]));
          console.log('journey.offers[0] details:', JSON.stringify(journey.offers[0]).substring(0, 400));
        }
        console.log('journey.segments length:', journey.segments?.length);
        if (journey.segments?.length > 0) {
          console.log('journey.segments[0] keys:', Object.keys(journey.segments[0]));
          console.log('journey.segments[0] details:', JSON.stringify(journey.segments[0]).substring(0, 400));
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}

run();
