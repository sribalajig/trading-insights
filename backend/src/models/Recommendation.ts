export interface RecommendationScore {
  name: string;
  score: number;
  maxScore: number;
  explanation: string;
}

export interface Recommendation {
  symbol: string;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  totalScore: number;
  maxScore: number;
  confidence: number; // percentage
  scores: RecommendationScore[];
  details: {
    currentPrice: number;
    ma50: number;
    ma200: number;
    recentTrend: number; // percentage change
    pricePosition: number; // 0-1 within 52-week range
    volatility: number; // percentage
    goldenCross: boolean;
  };
}

