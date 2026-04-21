import { searchHotels, getHotelDetails, getHotelRates } from './src/lib/api';

async function test() {
  console.log('--- Testing searchHotels ---');
  try {
    const search = await searchHotels('London', '2026-06-01', '2026-06-05', [{ adults: 2 }]);
    console.log('Search Result Count:', search.data.length);
    if (search.data.length > 0) {
      console.log('First Hotel:', search.data[0].name);
    }
  } catch (e) {
    console.error('searchHotels Failed:', e);
  }

  console.log('\n--- Testing getHotelDetails (Arctic TreeHouse) ---');
  try {
    const details = await getHotelDetails('arctic-treehouse');
    console.log('Curated Details:', details.data.name);
  } catch (e) {
    console.error('getHotelDetails (Curated) Failed:', e);
  }
}

test();
