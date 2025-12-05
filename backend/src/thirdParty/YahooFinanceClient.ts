import YahooFinance from 'yahoo-finance2';
import { IYahooFinanceClient } from './IYahooFinanceClient';
import { TickerSearchResult } from '../models/TickerSearchResult';

export class YahooFinanceClient implements IYahooFinanceClient {
  private yahooFinance: InstanceType<typeof YahooFinance>;

  constructor() {
    this.yahooFinance = new YahooFinance();
  }

  async search(query: string): Promise<TickerSearchResult[]> {
    try {
      const results: any = await this.yahooFinance.search(query);
      
      const quotes = results?.quotes || [];
      
      return quotes.map((quote: any) => ({
        symbol: quote.symbol || '',
        shortname: quote.shortname,
        longname: quote.longname,
        quoteType: quote.quoteType,
        exchange: quote.exchange,
        index: quote.index,
      }));
    } catch (error) {
      console.error('Error searching Yahoo Finance:', error);
      throw new Error('Failed to search tickers');
    }
  }
}

