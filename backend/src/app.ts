import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from "path";

import analyticsRoutes from './routes/analyticsRoutes';
import productRoutes from './routes/productRoutes';
import { connectMongoDB } from "./config/database";
import { errorHandler, notFound } from "./middleware/errorHandler";
import express, { Request, Response } from 'express';

const bodyParser = require("body-parser");

dotenv.config(); // Chargement des variables d'environnement

const app = express();

/* use CORS middleware with options
const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization'],    
};

app.use(cors(corsOptions));
*/

const midd = [
  bodyParser.urlencoded({
    extended: true,       //  for parsing URL-encoded data
  }),
  express.json(),
  express.urlencoded({ extended: false }),
  cors(),
];

// use Middleware
app.use(midd);
app.use(express.json());



//server connect
connectMongoDB();


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));
  app.get("/", (req: Request, res: Response) => res.sendFile(__dirname + '/public/index.html'));
} else {
  app.get("/", (req: Request, res: Response) => {
    res.send("API IS RUNNING 🚀...");
  });
}


// Routes pour les statistiques
app.use('/api/analytics', analyticsRoutes);
// Routes pour les produits
app.use('/api/products', productRoutes);


app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Serveur en cours d'exécution sur le port ${port}`);
});

