import { StockQuote } from '../models/StockQuote';
import { formatCurrency, formatLargeCurrency, formatNumber, formatPercent } from '../utils/formatting';
import './StockPrice.css';

interface StockPriceProps {
  quote: StockQuote;
  loading?: boolean;
  error?: string | null;
}

export function StockPrice({ quote, loading, error }: StockPriceProps) {
  if (loading) {
    return (
      <div className="stock-price-container">
        <div className="stock-price-loading">Loading stock data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-price-container">
        <div className="stock-price-error">Error: {error}</div>
      </div>
    );
  }

  const displayName = quote.longName || quote.shortName || quote.symbol;
  const price = quote.regularMarketPrice;
  const change = quote.regularMarketChange || 0;
  const changePercent = quote.regularMarketChangePercent || 0;
  const priceColor = '#2563eb';

  return (
    <div className="stock-price-container">
      <div className="stock-price-header">
        <div className="stock-symbol">{quote.symbol}</div>
        <div className="stock-name">{displayName}</div>
        {quote.exchange && (
          <div className="stock-exchange">{quote.exchange}</div>
        )}
      </div>

      <div className="stock-price-main">
        <div className="stock-price-value" style={{ color: priceColor }}>
          {formatCurrency(price, quote.currency)}
        </div>
        <div className="stock-price-change" style={{ color: priceColor }}>
          {formatCurrency(change, quote.currency)} ({formatPercent(changePercent)})
        </div>
        {quote.marketState && (
          <div className="stock-market-state">
            Market: {quote.marketState}
          </div>
        )}
      </div>

      <div className="stock-price-metadata">
        <div className="metadata-row">
          <div className="metadata-item">
            <span className="metadata-label">Day Range:</span>
            <span className="metadata-value">
              {formatCurrency(quote.dayLow, quote.currency)} - {formatCurrency(quote.dayHigh, quote.currency)}
            </span>
          </div>
        </div>
        <div className="metadata-row">
          <div className="metadata-item">
            <span className="metadata-label">52 Week Range:</span>
            <span className="metadata-value">
              {formatCurrency(quote.fiftyTwoWeekLow, quote.currency)} - {formatCurrency(quote.fiftyTwoWeekHigh, quote.currency)}
            </span>
          </div>
        </div>
        <div className="metadata-row">
          <div className="metadata-item">
            <span className="metadata-label">Market Cap:</span>
            <span className="metadata-value">{formatLargeCurrency(quote.marketCap, quote.currency)}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Volume:</span>
            <span className="metadata-value">{formatNumber(quote.volume)}</span>
          </div>
        </div>
        {quote.averageVolume && (
          <div className="metadata-row">
            <div className="metadata-item">
              <span className="metadata-label">Avg Volume:</span>
              <span className="metadata-value">{formatNumber(quote.averageVolume)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

