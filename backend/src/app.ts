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

if (process.env.NODE_ENV === "production") { 
  const corsOptions = {
    origin: "https://ecommerce-dashboard-i3dx.onrender.com/", 
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type', 'Authorization'],    
  };

  app.use(cors(corsOptions));
}

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
  // Servir les fichiers statiques de votre application frontend
  app.use(express.static(path.join(__dirname, "public")));

  // Gérer les requêtes aux routes API
  app.use('/api', (req, res, next) => {
    res.status(404).json({ error: "API route not found" }); // Retourne une erreur JSON si la route n'existe pas
  });

  // Rediriger toutes les autres routes vers index.html (SPA support)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });
} else {
  // En mode développement, une simple route pour vérifier si le serveur fonctionne
  app.get("/", (req, res) => {
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

