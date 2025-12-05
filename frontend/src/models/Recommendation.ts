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
  confidence: number;
  scores: RecommendationScore[];
  details: {
    currentPrice: number;
    ma50: number;
    ma200: number;
    recentTrend: number;
    pricePosition: number;
    volatility: number;
    goldenCross: boolean;
  };
}

