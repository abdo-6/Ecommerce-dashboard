import { Request, Response } from 'express';
import Sale from '../models/Sale';
import Product from '../models/Product';

//  GET /analytics/total_sales

export const getTotalSales = async (req: Request, res: Response) => {

  const { period } = req.query; // e.g., "7d", "30d", "12m"
  const periodMap = { '7d': 7, '30d': 30, '12m': 365 };
  const days = periodMap[period as keyof typeof periodMap] || 7; // maper les perides


  const date = new Date();
  date.setDate(date.getDate() - days);


  const sales = await Sale.aggregate([
    { $match: { saleDate: { $gte: date } } },
    { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $group: { _id: null, totalSales: { $sum: { $multiply: ['$quantity', '$product.price'] } } } },
  ]);

  //  renvoie le montant total des ventes pour la période sélectionnée.
  res.json({ total: sales[0]?.totalSales || 0 });

};

//  GET /analytics/trending_products
export const getTrendingProducts = async (req: Request, res: Response) => {

    const sales = await Sale.aggregate([
      { $group: { _id: '$productId', quantity: { $sum: '$quantity' } } },
      { $sort: { quantity: -1 } },
      { $limit: 3 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { name: '$product.name', quantity: 1, totalSales: { $multiply: ['$quantity', '$product.price'] } } },
    ]);

    /*  renvoie la liste des 3 produits les plus tendance avec leur nom, la quantité vendue et le 
    montant total des ventes. */
    res.json(sales);     
    
};

//  GET /analytics/category_sales
export const getCategorySales = async (req: Request, res: Response) => {

    const totalSales = await Sale.aggregate([
      { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $group: { _id: '$product.category', total: { $sum: '$quantity' } } },
    ]);


    const totalSalesAmount = totalSales.reduce((sum, categorySale) => sum + categorySale.total, 0);

    const categorySales = totalSales.map(categorySale => ({
      category: categorySale._id,
      totalSales: categorySale.total,
      percentage: ((categorySale.total / totalSalesAmount) * 100).toFixed(2),
    }));

    //  renvoie la répartition des ventes par catégorie, y compris le nombre et le pourcentage des ventes
    res.json(categorySales);

};