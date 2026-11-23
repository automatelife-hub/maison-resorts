process.env.LITEAPI_KEY = 'REDACTED_LITEAPI_KEY';

async function runTest() {
  const { searchHotels } = await import('./src/lib/api');
  try {
    console.log('Testing searchHotels with tomorrow dates...');
    const tmr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const dayAfter = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    const result = await searchHotels(
      'Amalfi Coast, Italy',
      tmr,
      dayAfter,
      [{ adults: 2 }]
    );
    console.log(`Found ${result.data?.length} hotels.`);
    if (result.data?.length > 0) {
      console.log('Sample hotel:', result.data[0].name);
    }
  } catch (err) {
    console.error('Test failed:', err);
  }
}

runTest();
