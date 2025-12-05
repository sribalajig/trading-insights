import { TickerSearchResult } from '../models/TickerSearchResult';
import { StockQuote } from '../models/StockQuote';
import { HistoricalData } from '../models/HistoricalData';

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

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  if (!symbol || symbol.trim().length === 0) {
    throw new Error('Symbol is required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/stocks/${encodeURIComponent(symbol)}/latest`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: StockQuote = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
}

export async function getHistoricalData(symbol: string, range: string): Promise<HistoricalData> {
  if (!symbol || symbol.trim().length === 0) {
    throw new Error('Symbol is required');
  }

  if (!range || !['1w', '1m', '6m', '1y'].includes(range)) {
    throw new Error('Range must be one of: 1w, 1m, 6m, 1y');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/stocks/${encodeURIComponent(symbol)}/history?range=${range}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: HistoricalData = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
}

