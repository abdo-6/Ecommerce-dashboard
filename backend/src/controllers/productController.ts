import { Request, Response } from 'express';
import Product from '../models/Product';
import Sale from '../models/Sale';

//  récupère tous les produits avec leur nom, categorie, prix, le nombre de ventes et la date de la première vente
export const getProducts = async (req: Request, res: Response) => {

    try {
      
      const products = await Product.aggregate([
        {
          $lookup: {
            from: 'sales',                  //  Nom de la collection "sales"
            localField: '_id',              //  Champ local (ID du produit)
            foreignField: 'productId',      //  Champ correspondant dans la collection "sales"
            as: 'sales',                    //  Alias pour les résultats
          },
        },
        {
          $addFields: {
            totalSales: { $sum: '$sales.quantity' },      //  Somme des quantités vendues
            firstSaleDate: {
              $cond: {
                if: { $gt: [{ $size: '$sales' }, 0] },           //  Si des ventes existent
                then: { $min: '$sales.saleDate' },              //  Utiliser la première date de vente
                else: { $ifNull: ['$dateAdded', new Date()] }, //  Sinon, utiliser la date d'ajout existante ou la date actuelle
              },
            },
          },
        },
        {
          $project: {
            name: 1,
            category: 1,
            price: 1,
            firstSaleDate: 1,       //  Date de la première vente
            totalSales: 1,          //  Nombre total de ventes
          },
        },
      ]);

      res.status(200).json(products);

    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des produits avec leurs ventes', error });
    }

};
