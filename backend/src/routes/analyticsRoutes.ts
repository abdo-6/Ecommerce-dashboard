import express from 'express';
import { getTotalSales, getTrendingProducts, getCategorySales } from '../controllers/analyticsController';

const router = express.Router();

router.get('/total_sales' , getTotalSales);
router.get('/trending_products', getTrendingProducts);
router.get('/category_sales', getCategorySales);

export default router;
