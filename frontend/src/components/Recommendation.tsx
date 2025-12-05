import { useState } from 'react';
import { Recommendation as RecommendationType } from '../models/Recommendation';
import { formatCurrency, formatPercent } from '../utils/formatting';
import './Recommendation.css';

interface RecommendationProps {
  recommendation: RecommendationType | null;
  loading?: boolean;
  error?: string | null;
}

export function Recommendation({ recommendation, loading, error }: RecommendationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) {
    return (
      <div className="recommendation-container">
        <div className="recommendation-loading">Calculating recommendation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-container">
        <div className="recommendation-error">Error: {error}</div>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  const getRecommendationColor = () => {
    switch (recommendation.recommendation) {
      case 'BUY':
        return '#16a34a';
      case 'SELL':
        return '#dc2626';
      case 'HOLD':
        return '#f59e0b';
      default:
        return '#666';
    }
  };

  return (
    <div className="recommendation-container">
      <div
        className="recommendation-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="recommendation-main">
          <div
            className="recommendation-badge"
            style={{ color: getRecommendationColor() }}
          >
            {recommendation.recommendation}
          </div>
          <div className="recommendation-confidence">
            Confidence: {recommendation.confidence.toFixed(1)}%
          </div>
          <div className="recommendation-score">
            Score: {recommendation.totalScore.toFixed(1)} / {recommendation.maxScore}
          </div>
        </div>
        <div className="recommendation-toggle">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>

      {isExpanded && (
        <div className="recommendation-details">
          <div className="recommendation-metrics">
            <div className="metric-item">
              <span className="metric-label">Current Price:</span>
              <span className="metric-value">
                {formatCurrency(recommendation.details.currentPrice)}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">50-Day MA:</span>
              <span className="metric-value">
                {formatCurrency(recommendation.details.ma50)}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">200-Day MA:</span>
              <span className="metric-value">
                {formatCurrency(recommendation.details.ma200)}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Recent Trend:</span>
              <span className="metric-value">
                {formatPercent(recommendation.details.recentTrend)}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Price Position:</span>
              <span className="metric-value">
                {(recommendation.details.pricePosition * 100).toFixed(1)}% of 52-week range
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Volatility:</span>
              <span className="metric-value">
                {formatPercent(recommendation.details.volatility)}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Cross Signal:</span>
              <span className="metric-value">
                {recommendation.details.goldenCross ? 'Golden Cross' : 'Death Cross'}
              </span>
            </div>
          </div>

          <div className="recommendation-scores">
            <h3 className="scores-title">Score Breakdown</h3>
            {recommendation.scores.map((score, index) => (
              <div key={index} className="score-item">
                <div className="score-header">
                  <span className="score-name">{score.name}</span>
                  <span className="score-value">
                    {score.score.toFixed(1)} / {score.maxScore}
                  </span>
                </div>
                <div className="score-bar-container">
                  <div
                    className="score-bar"
                    style={{
                      width: `${(score.score / score.maxScore) * 100}%`,
                      backgroundColor: score.score >= score.maxScore * 0.6 ? '#16a34a' : 
                                      score.score <= score.maxScore * 0.4 ? '#dc2626' : '#f59e0b',
                    }}
                  />
                </div>
                <div className="score-explanation">{score.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

