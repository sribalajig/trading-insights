import { Request, Response } from 'express';
import { StockService } from '../services/StockService';

export class StockController {
  constructor(private stockService: StockService) {}

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
}

