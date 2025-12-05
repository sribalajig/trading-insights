import { IYahooFinanceClient } from '../thirdParty/IYahooFinanceClient';
import { StockQuote } from '../models/StockQuote';
import { HistoricalData } from '../models/HistoricalData';
import { Recommendation, RecommendationScore } from '../models/Recommendation';

export class RecommendationService {
  constructor(private yahooFinanceClient: IYahooFinanceClient) {}

  async getRecommendation(symbol: string): Promise<Recommendation> {
    if (!symbol || symbol.trim().length === 0) {
      throw new Error('Symbol is required');
    }

    const trimmedSymbol = symbol.trim().toUpperCase();

    try {
      // Get current quote for 52-week range and current price
      const quote = await this.yahooFinanceClient.getQuote(trimmedSymbol);
      
      // Get 1 year of historical data for calculations
      const period2 = new Date();
      const period1 = new Date();
      period1.setFullYear(period2.getFullYear() - 1);
      
      const historicalData = await this.yahooFinanceClient.getHistoricalData(
        trimmedSymbol,
        period1,
        period2
      );

      if (!historicalData.data || historicalData.data.length < 200) {
        throw new Error('Insufficient historical data for recommendation');
      }

      // Sort data by date (oldest first)
      const sortedData = [...historicalData.data].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );

      const currentPrice = quote.regularMarketPrice || sortedData[sortedData.length - 1].close;
      const prices = sortedData.map((d) => d.close);

      // Calculate moving averages
      const ma50 = this.calculateMovingAverage(prices, 50);
      const ma200 = this.calculateMovingAverage(prices, 200);

      // Calculate recent trend (last 30 days vs previous 30 days)
      const recentTrend = this.calculateRecentTrend(sortedData);

      // Calculate price position within 52-week range
      const pricePosition = this.calculatePricePosition(
        currentPrice,
        quote.fiftyTwoWeekLow || Math.min(...prices),
        quote.fiftyTwoWeekHigh || Math.max(...prices)
      );

      // Calculate volatility (standard deviation as percentage)
      const volatility = this.calculateVolatility(prices);

      // Check for Golden/Death cross
      const goldenCross = ma50 > ma200;

      // Calculate scores
      const scores = this.calculateScores(
        currentPrice,
        ma50,
        ma200,
        recentTrend,
        pricePosition,
        goldenCross,
        volatility
      );

      const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
      const maxScore = scores.reduce((sum, s) => sum + s.maxScore, 0);
      const confidence = (totalScore / maxScore) * 100;

      // Determine recommendation
      let recommendation: 'BUY' | 'SELL' | 'HOLD';
      if (totalScore >= maxScore * 0.6) {
        recommendation = 'BUY';
      } else if (totalScore <= maxScore * 0.4) {
        recommendation = 'SELL';
      } else {
        recommendation = 'HOLD';
      }

      return {
        symbol: trimmedSymbol,
        recommendation,
        totalScore,
        maxScore,
        confidence,
        scores,
        details: {
          currentPrice,
          ma50,
          ma200,
          recentTrend,
          pricePosition,
          volatility,
          goldenCross,
        },
      };
    } catch (error) {
      console.error('RecommendationService error:', error);
      throw error;
    }
  }

  private calculateMovingAverage(prices: number[], period: number): number {
    if (prices.length < period) {
      return prices.reduce((sum, p) => sum + p, 0) / prices.length;
    }
    const recentPrices = prices.slice(-period);
    return recentPrices.reduce((sum, p) => sum + p, 0) / period;
  }

  private calculateRecentTrend(data: Array<{ date: Date; close: number }>): number {
    if (data.length < 60) {
      return 0;
    }
    
    const last30Days = data.slice(-30);
    const previous30Days = data.slice(-60, -30);
    
    const last30Avg = last30Days.reduce((sum, d) => sum + d.close, 0) / 30;
    const previous30Avg = previous30Days.reduce((sum, d) => sum + d.close, 0) / 30;
    
    return ((last30Avg - previous30Avg) / previous30Avg) * 100;
  }

  private calculatePricePosition(
    currentPrice: number,
    low52Week: number,
    high52Week: number
  ): number {
    if (high52Week === low52Week) return 0.5;
    return (currentPrice - low52Week) / (high52Week - low52Week);
  }

  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;
    
    const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);
    
    return (stdDev / mean) * 100;
  }

  private calculateScores(
    currentPrice: number,
    ma50: number,
    ma200: number,
    recentTrend: number,
    pricePosition: number,
    goldenCross: boolean,
    volatility: number
  ): RecommendationScore[] {
    const scores: RecommendationScore[] = [];

    // Price vs MAs (30 pts)
    let priceVsMAScore = 0;
    let priceVsMAExplanation = '';
    if (currentPrice > ma50 && currentPrice > ma200) {
      priceVsMAScore = 30;
      priceVsMAExplanation = 'Price is above both 50-day and 200-day moving averages (bullish)';
    } else if (currentPrice < ma50 && currentPrice < ma200) {
      priceVsMAScore = 0;
      priceVsMAExplanation = 'Price is below both 50-day and 200-day moving averages (bearish)';
    } else {
      priceVsMAScore = 15;
      priceVsMAExplanation = 'Price is between the moving averages (neutral)';
    }
    scores.push({
      name: 'Price vs Moving Averages',
      score: priceVsMAScore,
      maxScore: 30,
      explanation: priceVsMAExplanation,
    });

    // Recent trend (25 pts)
    let trendScore = 0;
    let trendExplanation = '';
    if (recentTrend > 5) {
      trendScore = 25;
      trendExplanation = `Strong upward trend: ${recentTrend.toFixed(2)}% increase in last 30 days`;
    } else if (recentTrend < -5) {
      trendScore = 0;
      trendExplanation = `Strong downward trend: ${Math.abs(recentTrend).toFixed(2)}% decrease in last 30 days`;
    } else {
      trendScore = 12.5;
      trendExplanation = `Neutral trend: ${recentTrend.toFixed(2)}% change in last 30 days`;
    }
    scores.push({
      name: 'Recent Trend',
      score: trendScore,
      maxScore: 25,
      explanation: trendExplanation,
    });

    // Price position (20 pts)
    let positionScore = 0;
    let positionExplanation = '';
    if (pricePosition < 0.3) {
      positionScore = 20;
      positionExplanation = `Price is near 52-week low (${(pricePosition * 100).toFixed(1)}% of range) - potential buying opportunity`;
    } else if (pricePosition > 0.7) {
      positionScore = 0;
      positionExplanation = `Price is near 52-week high (${(pricePosition * 100).toFixed(1)}% of range) - potential selling opportunity`;
    } else {
      positionScore = 10;
      positionExplanation = `Price is in middle of 52-week range (${(pricePosition * 100).toFixed(1)}% of range)`;
    }
    scores.push({
      name: 'Price Position',
      score: positionScore,
      maxScore: 20,
      explanation: positionExplanation,
    });

    // Golden/Death cross (15 pts)
    const crossScore = goldenCross ? 15 : 0;
    const crossExplanation = goldenCross
      ? 'Golden Cross: 50-day MA is above 200-day MA (bullish signal)'
      : 'Death Cross: 50-day MA is below 200-day MA (bearish signal)';
    scores.push({
      name: 'Golden/Death Cross',
      score: crossScore,
      maxScore: 15,
      explanation: crossExplanation,
    });

    // Volatility (10 pts)
    let volatilityScore = 0;
    let volatilityExplanation = '';
    if (volatility < 15) {
      volatilityScore = 10;
      volatilityExplanation = `Low volatility (${volatility.toFixed(2)}%) - stable price movement`;
    } else if (volatility > 30) {
      volatilityScore = 0;
      volatilityExplanation = `High volatility (${volatility.toFixed(2)}%) - unstable price movement`;
    } else {
      volatilityScore = 5;
      volatilityExplanation = `Moderate volatility (${volatility.toFixed(2)}%)`;
    }
    scores.push({
      name: 'Volatility',
      score: volatilityScore,
      maxScore: 10,
      explanation: volatilityExplanation,
    });

    return scores;
  }
}

