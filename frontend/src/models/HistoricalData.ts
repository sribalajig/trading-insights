import { HistoricalDataPoint } from './HistoricalDataPoint';

export interface HistoricalData {
  symbol: string;
  data: HistoricalDataPoint[];
}

