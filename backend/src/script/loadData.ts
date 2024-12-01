import mongoose from 'mongoose';
import fs from 'fs';
import csvParser from 'csv-parser';
import * as dotenv from 'dotenv';
import Product from '../models/Product';
import Sale from '../models/Sale';

dotenv.config();

const mongoUri = process.env.MONGO_DB_URI!;

//  Connection MongoDB
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

  const loadProducts = async (filePath: string): Promise<Map<string, string>> => {
    console.log('Loading products...');
    const products: any[] = [];
    const productIdMap = new Map<string, string>(); //  Mappage pour stocker l'ID personnalisé -> mappage ObjectId
  
    return new Promise<Map<string, string>>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          
          const product = {
            _id: new mongoose.Types.ObjectId(), // Générer un ObjectId pour chaque produit
            customId: row['ProductID'],    
            name: row['ProductName'],
            category: row['Category'],
            price: parseFloat(row['Price']),
          };

          productIdMap.set(row['ProductID'], product._id.toString());  //   Mapper l'ID personnalisé à l'ObjectId
          products.push(product);

        })
        .on('end', async () => {
          try {

              await Product.deleteMany();             //  Effacer la collection existante  s'il existe
              await Product.insertMany(products);     //  insérer les produits
              console.log(`${products.length} products loaded successfully.`);
              resolve(productIdMap);

          } catch (error) {

              console.error('Error loading products:', error);
              reject(error);

          }
        })
        .on('error', (error) => reject(error));

    });
  };
  
  const loadSales = async (filePath: string, productIdMap: Map<string, string>): Promise<void> => {

    console.log('Loading sales...');
    const sales: any[] = [];
  
    return new Promise<void>((resolve, reject) => {

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {

          const mappedProductId = productIdMap.get(row['ProductID']); //  Obtenir l'ObjectId en utilisant le map

          if (!mappedProductId) {
            console.warn(`No product found for custom ID: ${row['ProductID']}`);
            return;   //   Ignorer cette vente si aucun produit correspondant n'a été trouvé
          }

          const sale = {
            productId: mappedProductId,
            quantity: parseInt(row['Quantity'], 10),
            saleDate: new Date(row['Date']),
          };

          sales.push(sale);

        })
        .on('end', async () => {

            try {

              await Sale.deleteMany();        //   Effacer les ventes existantes
              await Sale.insertMany(sales);   // Insérer les ventes
              console.log(`${sales.length} sales loaded successfully.`);
              resolve();

            } catch (error) {

              console.error('Error loading sales:', error);
              reject(error);

            }
        })

        .on('error', (error) => reject(error));

    });
  };
  
  //  execution du script
  const run = async (): Promise<void> => {

      try {

          const productIdMap = await loadProducts('src/data/products.csv');   //  Charger les produits et obtenir ID map
          await loadSales('src/data/sales.csv', productIdMap); //  Charger les ventes en utilisant productIdMap
          console.log('Data loaded successfully.');

      } catch (error) {

          console.error('Error during data loading:', error);

      } finally {

          mongoose.disconnect();

      }
  };
  
  run();