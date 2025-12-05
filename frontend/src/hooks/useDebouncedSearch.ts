import { useState, useEffect } from 'react';
import { TickerSearchResult } from '../models/TickerSearchResult';
import { searchTickers } from '../utils/api';

interface UseDebouncedSearchResult {
  query: string;
  results: TickerSearchResult[];
  loading: boolean;
  error: string | null;
  setQuery: (query: string) => void;
}

export function useDebouncedSearch(
  debounceDelay: number = 300
): UseDebouncedSearchResult {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<TickerSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await searchTickers(query);
        setResults(searchResults);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search tickers');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query, debounceDelay]);

  return {
    query,
    results,
    loading,
    error,
    setQuery,
  };
}

