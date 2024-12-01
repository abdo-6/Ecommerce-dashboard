import express from 'express';
import { getProducts } from '../controllers/productController';

const router = express.Router();

// Route pour obtenir tous les produits avec leur nombre de ventes pour chaque produit
router.get('/', getProducts);


export default router;
