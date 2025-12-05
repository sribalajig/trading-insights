import { Router } from 'express';
import { StockController } from '../controllers/StockController';
import { StockService } from '../services/StockService';
import { YahooFinanceClient } from '../thirdParty/YahooFinanceClient';

const router = Router();

// Initialize dependencies (in a real app, this would use dependency injection)
const yahooFinanceClient = new YahooFinanceClient();
const stockService = new StockService(yahooFinanceClient);
const stockController = new StockController(stockService);

// GET /stocks/:symbol/latest
router.get('/stocks/:symbol/latest', (req, res) => {
  stockController.getLatestPrice(req, res);
});

export default router;

