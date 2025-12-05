import { TickerSearchResult } from '../models/TickerSearchResult';

export interface IYahooFinanceClient {
  search(query: string): Promise<TickerSearchResult[]>;
}

