import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { StockPrice } from './components/StockPrice';
import { HistoricalChart } from './components/HistoricalChart';
import { TimeRangeSelector } from './components/TimeRangeSelector';
import { Recommendation } from './components/Recommendation';
import { Tabs } from './components/Tabs';
import { Watchlist } from './components/Watchlist';
import { TickerSearchResult } from './models/TickerSearchResult';
import { StockQuote } from './models/StockQuote';
import { HistoricalData } from './models/HistoricalData';
import { Recommendation as RecommendationType } from './models/Recommendation';
import { getStockQuote, getHistoricalData, getRecommendation } from './utils/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'watchlist'>('search');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationType | null>(null);
  const [selectedRange, setSelectedRange] = useState<string>('1m');
  const [loading, setLoading] = useState<boolean>(false);
  const [historicalLoading, setHistoricalLoading] = useState<boolean>(false);
  const [recommendationLoading, setRecommendationLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalError, setHistoricalError] = useState<string | null>(null);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);

  const handleSelectTicker = (ticker: TickerSearchResult) => {
    setSelectedSymbol(ticker.symbol);
    setError(null);
    setHistoricalError(null);
    setRecommendationError(null);
  };

  const handleSelectStockFromWatchlist = (symbol: string) => {
    setSelectedSymbol(symbol);
    setError(null);
    setHistoricalError(null);
    setRecommendationError(null);
  };

  useEffect(() => {
    if (!selectedSymbol) {
      setQuote(null);
      setHistoricalData(null);
      setRecommendation(null);
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

  useEffect(() => {
    if (!selectedSymbol) {
      setRecommendation(null);
      return;
    }

    const fetchRecommendation = async () => {
      setRecommendationLoading(true);
      setRecommendationError(null);
      try {
        const rec = await getRecommendation(selectedSymbol);
        setRecommendation(rec);
      } catch (err) {
        setRecommendationError(err instanceof Error ? err.message : 'Failed to fetch recommendation');
        setRecommendation(null);
      } finally {
        setRecommendationLoading(false);
      }
    };

    fetchRecommendation();
  }, [selectedSymbol]);

  return (
    <div className="app">
      <main className="app-main">
        <div className="app-content">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {activeTab === 'search' && (
            <>
              <SearchBar onSelectTicker={handleSelectTicker} />
              {selectedSymbol && (
                <>
                  <Recommendation 
                    recommendation={recommendation} 
                    loading={recommendationLoading} 
                    error={recommendationError} 
                  />
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
                </>
              )}
            </>
          )}

          {activeTab === 'watchlist' && (
            <>
              <Watchlist key="watchlist" onSelectStock={handleSelectStockFromWatchlist} />
              {selectedSymbol && (
                <>
                  <Recommendation 
                    recommendation={recommendation} 
                    loading={recommendationLoading} 
                    error={recommendationError} 
                  />
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
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

