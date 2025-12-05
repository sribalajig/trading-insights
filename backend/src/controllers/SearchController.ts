import { Request, Response } from 'express';
import { SearchService } from '../services/SearchService';

export class SearchController {
  constructor(private searchService: SearchService) {}

  async search(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;

      if (!query) {
        res.status(400).json({ 
          error: 'Query parameter "q" is required' 
        });
        return;
      }

      const results = await this.searchService.searchTickers(query);
      res.json(results);
    } catch (error) {
      console.error('SearchController error:', error);
      res.status(500).json({ 
        error: 'Failed to search tickers',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

