export function formatCurrency(value?: number, currency?: string): string {
  if (value === undefined || value === null) return 'N/A';
  const currencySymbol = currency === 'USD' ? '$' : currency || '$';
  return `${currencySymbol}${value.toFixed(2)}`;
}

export function formatLargeCurrency(value?: number, currency?: string): string {
  if (value === undefined || value === null) return 'N/A';
  const currencySymbol = currency === 'USD' ? '$' : currency || '$';
  if (value >= 1e12) return `${currencySymbol}${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${currencySymbol}${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${currencySymbol}${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${currencySymbol}${(value / 1e3).toFixed(2)}K`;
  return `${currencySymbol}${value.toFixed(2)}`;
}

export function formatNumber(value?: number): string {
  if (value === undefined || value === null) return 'N/A';
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

