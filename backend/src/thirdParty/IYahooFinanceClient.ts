import { TickerSearchResult } from '../models/TickerSearchResult';
import { StockQuote } from '../models/StockQuote';

export interface IYahooFinanceClient {
  search(query: string): Promise<TickerSearchResult[]>;
  getQuote(symbol: string): Promise<StockQuote>;
}

