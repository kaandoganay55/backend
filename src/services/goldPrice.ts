import axios from 'axios';

// We'll use the Gold API (https://www.goldapi.io/) for real-time gold prices
// You'll need to sign up for a free API key
const GOLD_API_KEY = process.env.GOLD_API_KEY || '';
const GOLD_API_URL = 'https://www.goldapi.io/api/XAU/USD';

export async function getGoldPrice(): Promise<number> {
  try {
    const response = await axios.get(GOLD_API_URL, {
      headers: {
        'x-access-token': GOLD_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    // Price is returned in USD per troy ounce
    // Convert to USD per gram (1 troy ounce = 31.1034768 grams)
    return response.data.price / 31.1034768;
  } catch (error) {
    console.error('Error fetching gold price:', error);
    // Return a fallback price of $60 per gram if API fails
    return 60;
  }
} 