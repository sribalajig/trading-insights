import { IYahooFinanceClient } from '../thirdParty/IYahooFinanceClient';
import { StockQuote } from '../models/StockQuote';

export class StockService {
  constructor(private yahooFinanceClient: IYahooFinanceClient) {}

  async getQuote(symbol: string): Promise<StockQuote> {
    if (!symbol || symbol.trim().length === 0) {
      throw new Error('Symbol is required');
    }

    const trimmedSymbol = symbol.trim().toUpperCase();

    try {
      const quote = await this.yahooFinanceClient.getQuote(trimmedSymbol);
      return quote;
    } catch (error) {
      console.error('StockService error:', error);
      throw error;
    }
  }
}

