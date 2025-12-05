import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { StockPrice } from './components/StockPrice';
import { TickerSearchResult } from './models/TickerSearchResult';
import { StockQuote } from './models/StockQuote';
import { getStockQuote } from './utils/api';
import './App.css';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectTicker = (ticker: TickerSearchResult) => {
    setSelectedSymbol(ticker.symbol);
    setError(null);
  };

  useEffect(() => {
    if (!selectedSymbol) {
      setQuote(null);
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

  return (
    <div className="app">
      <main className="app-main">
        <div className="app-content">
          <SearchBar onSelectTicker={handleSelectTicker} />
          {selectedSymbol && (
            <StockPrice 
              quote={quote || { symbol: selectedSymbol }} 
              loading={loading} 
              error={error} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

