import { Router } from 'express';
import { SearchController } from '../controllers/SearchController';
import { SearchService } from '../services/SearchService';
import { YahooFinanceClient } from '../thirdParty/YahooFinanceClient';

const router = Router();

// Initialize dependencies (in a real app, this would use dependency injection)
const yahooFinanceClient = new YahooFinanceClient();
const searchService = new SearchService(yahooFinanceClient);
const searchController = new SearchController(searchService);

// GET /search?q=<query>
router.get('/search', (req, res) => {
  searchController.search(req, res);
});

export default router;

