import { TickerSearchResult } from '../models/TickerSearchResult';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function searchTickers(query: string): Promise<TickerSearchResult[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: TickerSearchResult[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching tickers:', error);
    throw error;
  }
}

