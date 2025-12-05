const WATCHLIST_KEY = 'trading_insights_watchlist';

export function getWatchlist(): string[] {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (!stored) return [];
    const symbols = JSON.parse(stored);
    return Array.isArray(symbols) ? symbols : [];
  } catch (error) {
    console.error('Error reading watchlist from localStorage:', error);
    return [];
  }
}

export function addToWatchlist(symbol: string): void {
  if (!symbol || symbol.trim().length === 0) {
    return;
  }

  const trimmedSymbol = symbol.trim().toUpperCase();
  const watchlist = getWatchlist();

  // Avoid duplicates
  if (watchlist.includes(trimmedSymbol)) {
    return;
  }

  try {
    const updated = [...watchlist, trimmedSymbol];
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving watchlist to localStorage:', error);
  }
}

export function isInWatchlist(symbol: string): boolean {
  if (!symbol || symbol.trim().length === 0) {
    return false;
  }

  const trimmedSymbol = symbol.trim().toUpperCase();
  const watchlist = getWatchlist();
  return watchlist.includes(trimmedSymbol);
}

