import { TickerSearchResult } from '../models/TickerSearchResult';
import { StockQuote } from '../models/StockQuote';
import { HistoricalData } from '../models/HistoricalData';

export interface IYahooFinanceClient {
  search(query: string): Promise<TickerSearchResult[]>;
  getQuote(symbol: string): Promise<StockQuote>;
  getHistoricalData(symbol: string, period1: Date, period2: Date): Promise<HistoricalData>;
}

