import YahooFinance from 'yahoo-finance2';
import { IYahooFinanceClient } from './IYahooFinanceClient';
import { TickerSearchResult } from '../models/TickerSearchResult';
import { StockQuote } from '../models/StockQuote';

export class YahooFinanceClient implements IYahooFinanceClient {
  private yahooFinance: InstanceType<typeof YahooFinance>;

  constructor() {
    this.yahooFinance = new YahooFinance();
  }

  async search(query: string): Promise<TickerSearchResult[]> {
    try {
      const results: any = await this.yahooFinance.search(query);
      
      const quotes = results?.quotes || [];
      
      // Filter to only equity stocks (exclude options, indices, etc.)
      const equityQuotes = quotes.filter((quote: any) => quote.quoteType === 'EQUITY');
      
      return equityQuotes.map((quote: any) => ({
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

  async getQuote(symbol: string): Promise<StockQuote> {
    try {
      const quote: any = await this.yahooFinance.quote(symbol);
      
      return {
        symbol: quote.symbol || symbol,
        shortName: quote.shortName,
        longName: quote.longName,
        regularMarketPrice: quote.regularMarketPrice,
        regularMarketChange: quote.regularMarketChange,
        regularMarketChangePercent: quote.regularMarketChangePercent,
        regularMarketTime: quote.regularMarketTime ? new Date(quote.regularMarketTime * 1000) : undefined,
        currency: quote.currency,
        exchange: quote.fullExchangeName || quote.exchange,
        quoteType: quote.quoteType,
        marketState: quote.marketState,
        marketCap: quote.marketCap,
        volume: quote.regularMarketVolume,
        averageVolume: quote.averageDailyVolume10Day,
        dayHigh: quote.regularMarketDayHigh,
        dayLow: quote.regularMarketDayLow,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      };
    } catch (error) {
      console.error('Error fetching quote from Yahoo Finance:', error);
      throw new Error(`Failed to fetch quote for ${symbol}`);
    }
  }
}

