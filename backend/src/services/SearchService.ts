import { IYahooFinanceClient } from '../thirdParty/IYahooFinanceClient';
import { TickerSearchResult } from '../models/TickerSearchResult';

export class SearchService {
  constructor(private yahooFinanceClient: IYahooFinanceClient) {}

  async searchTickers(query: string): Promise<TickerSearchResult[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    // Trim and validate query
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 1) {
      return [];
    }

    try {
      const results = await this.yahooFinanceClient.search(trimmedQuery);
      return results;
    } catch (error) {
      console.error('SearchService error:', error);
      throw error;
    }
  }
}

