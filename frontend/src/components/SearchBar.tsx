import React from 'react';
import { useDebouncedSearch } from '../hooks/useDebouncedSearch';
import { TickerSearchResult } from '../models/TickerSearchResult';
import './SearchBar.css';

interface SearchBarProps {
  onSelectTicker?: (ticker: TickerSearchResult) => void;
}

export function SearchBar({ onSelectTicker }: SearchBarProps) {
  const { query, results, loading, error, setQuery } = useDebouncedSearch(300);
  const [showResults, setShowResults] = React.useState<boolean>(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowResults(true);
  };

  const handleSelectTicker = (ticker: TickerSearchResult) => {
    setQuery(ticker.symbol);
    setShowResults(false);
    onSelectTicker?.(ticker);
  };

  const handleClear = () => {
    setQuery('');
    setShowResults(true);
  };

  const displayName = (ticker: TickerSearchResult): string => {
    return ticker.longname || ticker.shortname || ticker.symbol;
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a ticker symbol (e.g., AAPL, MSFT)..."
          value={query}
          onChange={handleInputChange}
        />
        {query.length > 0 && !loading && (
          <button
            type="button"
            className="search-clear-button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
        {loading && <span className="search-loading">Loading...</span>}
      </div>

      {error && (
        <div className="search-error">
          Error: {error}
        </div>
      )}

      {results.length > 0 && query.length > 0 && showResults && (
        <ul className="search-results">
          {results.map((ticker, index) => (
            <li
              key={`${ticker.symbol}-${index}`}
              className="search-result-item"
              onClick={() => handleSelectTicker(ticker)}
            >
              <div className="result-symbol">{ticker.symbol}</div>
              <div className="result-name">{displayName(ticker)}</div>
              {ticker.exchange && (
                <div className="result-exchange">{ticker.exchange}</div>
              )}
            </li>
          ))}
        </ul>
      )}

      {results.length === 0 && query.length > 0 && !loading && !error && (
        <div className="search-no-results">No results found</div>
      )}
    </div>
  );
}

