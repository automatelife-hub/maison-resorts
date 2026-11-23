const liteApiSdk = require('liteapi-node-sdk');
const liteApi = liteApiSdk(process.env.LITEAPI_KEY);

async function runTest() {
  try {
    console.log('Testing LiteAPI direct...');
    const result = await liteApi.getFullRates({
      checkin: '2026-06-01',
      checkout: '2026-06-05',
      currency: 'USD',
      guestNationality: 'US',
      occupancies: [{ adults: 2, children: [] }],
      includeHotelData: true,
      placeId: '80ff36b0-1361-4fa3-ad88-466d13bd692f' // Paris placeId typically, but let's test with a valid one or just see the error.
    });
    console.log('Result status:', result.status);
    if (result.error || result.errors) {
      console.log('Errors:', JSON.stringify(result.error || result.errors, null, 2));
    }
  } catch (err) {
    console.error('Test exception:', err);
  }
}
runTest();
