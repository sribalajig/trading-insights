import { useEffect, useState } from 'react';
import { getWatchlist } from '../utils/storage';
import { getStockQuote } from '../utils/api';
import { StockQuote } from '../models/StockQuote';
import { formatCurrency, formatLargeCurrency, formatNumber } from '../utils/formatting';
import './Watchlist.css';

interface WatchlistProps {
  onSelectStock: (symbol: string) => void;
}

export function Watchlist({ onSelectStock }: WatchlistProps) {
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchQuotes = async (symbols: string[]) => {
    setLoading(true);
    setErrors({});
    const quotesMap: Record<string, StockQuote> = {};
    const errorsMap: Record<string, string> = {};

    // Fetch quotes for all symbols
    const promises = symbols.map(async (symbol) => {
      try {
        const quote = await getStockQuote(symbol);
        quotesMap[symbol] = quote;
      } catch (error) {
        errorsMap[symbol] = error instanceof Error ? error.message : 'Failed to fetch';
      }
    });

    await Promise.all(promises);
    setQuotes(quotesMap);
    setErrors(errorsMap);
    setLoading(false);
  };

  useEffect(() => {
    const loadWatchlist = () => {
      const symbols = getWatchlist();
      setWatchlistSymbols(symbols);

      if (symbols.length > 0) {
        fetchQuotes(symbols);
      } else {
        setQuotes({});
        setErrors({});
        setLoading(false);
      }
    };

    loadWatchlist();

    // Refresh watchlist when storage changes (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'trading_insights_watchlist') {
        loadWatchlist();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for changes (in case added from same tab)
    const interval = setInterval(() => {
      const currentSymbols = getWatchlist();
      const currentLength = currentSymbols.length;
      const previousLength = watchlistSymbols.length;
      
      if (currentLength !== previousLength || 
          (currentLength > 0 && previousLength > 0 && 
           !currentSymbols.every((s, i) => watchlistSymbols[i] === s))) {
        loadWatchlist();
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [watchlistSymbols.length]);

  const handleRowClick = (symbol: string) => {
    onSelectStock(symbol);
  };

  if (watchlistSymbols.length === 0) {
    return (
      <div className="watchlist-container">
        <div className="watchlist-empty">
          <p>Your watchlist is empty.</p>
          <p>Add stocks from the Search tab to track them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      {loading && (
        <div className="watchlist-loading">Loading watchlist data...</div>
      )}
      <table className="watchlist-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Latest Price</th>
            <th>Market Cap</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {watchlistSymbols.map((symbol) => {
            const quote = quotes[symbol];
            const error = errors[symbol];

            return (
              <tr
                key={symbol}
                className="watchlist-row"
                onClick={() => handleRowClick(symbol)}
              >
                <td className="ticker-cell">
                  <strong>{symbol}</strong>
                  {quote && (quote.shortName || quote.longName) && (
                    <div className="ticker-name">
                      {quote.shortName || quote.longName}
                    </div>
                  )}
                </td>
                <td>
                  {error ? (
                    <span className="error-text">Error</span>
                  ) : quote?.regularMarketPrice ? (
                    formatCurrency(quote.regularMarketPrice, quote.currency)
                  ) : (
                    <span className="loading-text">Loading...</span>
                  )}
                </td>
                <td>
                  {error ? (
                    <span className="error-text">-</span>
                  ) : quote?.marketCap ? (
                    formatLargeCurrency(quote.marketCap, quote.currency)
                  ) : (
                    <span className="loading-text">-</span>
                  )}
                </td>
                <td>
                  {error ? (
                    <span className="error-text">-</span>
                  ) : quote?.volume ? (
                    formatNumber(quote.volume)
                  ) : (
                    <span className="loading-text">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

