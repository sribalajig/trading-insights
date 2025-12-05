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

// GET /stocks/:symbol/history?range=1w|1m|6m|1y
router.get('/stocks/:symbol/history', (req, res) => {
  stockController.getHistory(req, res);
});

export default router;

