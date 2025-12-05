import { Request, Response } from 'express';
import { StockService } from '../services/StockService';
import { RecommendationService } from '../services/RecommendationService';

export class StockController {
  constructor(
    private stockService: StockService,
    private recommendationService: RecommendationService
  ) {}

  async getLatestPrice(req: Request, res: Response): Promise<void> {
    try {
      const symbol = req.params.symbol;

      if (!symbol) {
        res.status(400).json({ 
          error: 'Symbol parameter is required' 
        });
        return;
      }

      const quote = await this.stockService.getQuote(symbol);
      res.json(quote);
    } catch (error) {
      console.error('StockController error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch stock quote',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const symbol = req.params.symbol;
      const range = req.query.range as string;

      if (!symbol) {
        res.status(400).json({ 
          error: 'Symbol parameter is required' 
        });
        return;
      }

      if (!range) {
        res.status(400).json({ 
          error: 'Range query parameter is required (1w, 1m, 6m, 1y)' 
        });
        return;
      }

      const historicalData = await this.stockService.getHistoricalData(symbol, range);
      res.json(historicalData);
    } catch (error) {
      console.error('StockController error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch historical data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getRecommendation(req: Request, res: Response): Promise<void> {
    try {
      const symbol = req.params.symbol;

      if (!symbol) {
        res.status(400).json({ 
          error: 'Symbol parameter is required' 
        });
        return;
      }

      const recommendation = await this.recommendationService.getRecommendation(symbol);
      res.json(recommendation);
    } catch (error) {
      console.error('StockController error:', error);
      res.status(500).json({ 
        error: 'Failed to generate recommendation',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

