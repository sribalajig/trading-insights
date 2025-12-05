import { IYahooFinanceClient } from '../thirdParty/IYahooFinanceClient';
import { StockQuote } from '../models/StockQuote';
import { HistoricalData } from '../models/HistoricalData';

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

  async getHistoricalData(symbol: string, range: string): Promise<HistoricalData> {
    if (!symbol || symbol.trim().length === 0) {
      throw new Error('Symbol is required');
    }

    if (!range || !['1w', '1m', '6m', '1y'].includes(range)) {
      throw new Error('Range must be one of: 1w, 1m, 6m, 1y');
    }

    const trimmedSymbol = symbol.trim().toUpperCase();
    const period2 = new Date();
    const period1 = new Date();

    // Calculate period1 based on range
    switch (range) {
      case '1w':
        period1.setDate(period2.getDate() - 7);
        break;
      case '1m':
        period1.setMonth(period2.getMonth() - 1);
        break;
      case '6m':
        period1.setMonth(period2.getMonth() - 6);
        break;
      case '1y':
        period1.setFullYear(period2.getFullYear() - 1);
        break;
    }

    try {
      const historicalData = await this.yahooFinanceClient.getHistoricalData(
        trimmedSymbol,
        period1,
        period2
      );
      return historicalData;
    } catch (error) {
      console.error('StockService error:', error);
      throw error;
    }
  }
}

