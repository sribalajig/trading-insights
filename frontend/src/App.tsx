import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { StockPrice } from './components/StockPrice';
import { HistoricalChart } from './components/HistoricalChart';
import { TimeRangeSelector } from './components/TimeRangeSelector';
import { TickerSearchResult } from './models/TickerSearchResult';
import { StockQuote } from './models/StockQuote';
import { HistoricalData } from './models/HistoricalData';
import { getStockQuote, getHistoricalData } from './utils/api';
import './App.css';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [selectedRange, setSelectedRange] = useState<string>('1m');
  const [loading, setLoading] = useState<boolean>(false);
  const [historicalLoading, setHistoricalLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalError, setHistoricalError] = useState<string | null>(null);

  const handleSelectTicker = (ticker: TickerSearchResult) => {
    setSelectedSymbol(ticker.symbol);
    setError(null);
    setHistoricalError(null);
  };

  useEffect(() => {
    if (!selectedSymbol) {
      setQuote(null);
      setHistoricalData(null);
      return;
    }

    const fetchQuote = async () => {
      setLoading(true);
      setError(null);
      try {
        const stockQuote = await getStockQuote(selectedSymbol);
        setQuote(stockQuote);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock quote');
        setQuote(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [selectedSymbol]);

  useEffect(() => {
    if (!selectedSymbol) {
      setHistoricalData(null);
      return;
    }

    const fetchHistorical = async () => {
      setHistoricalLoading(true);
      setHistoricalError(null);
      try {
        const data = await getHistoricalData(selectedSymbol, selectedRange);
        setHistoricalData(data);
      } catch (err) {
        setHistoricalError(err instanceof Error ? err.message : 'Failed to fetch historical data');
        setHistoricalData(null);
      } finally {
        setHistoricalLoading(false);
      }
    };

    fetchHistorical();
  }, [selectedSymbol, selectedRange]);

  return (
    <div className="app">
      <main className="app-main">
        <div className="app-content">
          <SearchBar onSelectTicker={handleSelectTicker} />
          {selectedSymbol && (
            <div className="stock-details-container">
              <div className="stock-price-section">
                <StockPrice 
                  quote={quote || { symbol: selectedSymbol }} 
                  loading={loading} 
                  error={error} 
                />
              </div>
              <div className="stock-chart-section">
                <TimeRangeSelector 
                  selectedRange={selectedRange} 
                  onRangeChange={setSelectedRange} 
                />
                <HistoricalChart 
                  data={historicalData} 
                  loading={historicalLoading} 
                  error={historicalError} 
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

