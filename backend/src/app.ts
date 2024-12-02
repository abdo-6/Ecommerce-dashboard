import express, { Request, Response, Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet'; // Sécurise les en-têtes HTTP
import morgan from 'morgan'; // Log des requêtes HTTP

import analyticsRoutes from './routes/analyticsRoutes';
import productRoutes from './routes/productRoutes';
import { connectMongoDB } from './config/database'; // Connexion à la base de données MongoDB
import { errorHandler, notFound } from './middleware/errorHandler'; // Gestion des erreurs personnalisées

dotenv.config(); // Charge les variables d'environnement

const app: Application = express();

// Définition des middlewares
const midd = [
  express.json(), // Pour analyser les données JSON dans les requêtes
  express.urlencoded({ extended: true }), // Pour analyser les données encodées dans l'URL
  cors(), // Permet les requêtes CORS
  helmet(),  // Sécurise les en-têtes HTTP de l'application
];

// Utilisation des middlewares
app.use(midd);

// Configuration de CORS
if (process.env.NODE_ENV === 'production') {

    // Liste des origines autorisées en production (ajustez selon vos besoins)
    const allowedOrigins = ['https://ecommerce-dashboard-i3dx.onrender.com',]; 
    
    const corsOptions = {
      origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
        if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
            callback(null, true); // Accepte l'origine
        } else {
            callback(new Error('Not allowed by CORS'), false); // refuse l'origine non autorisée
        }
      },
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };

    app.use(cors(corsOptions)); 

}

//  utilisation de morgan pour loguer les requêtes HTTP
if (process.env.NODE_ENV === 'development') {

    app.use(morgan('dev'));            //  mode développement : logs détaillés

} else {

    app.use(morgan('combined'));      //  mode production : logs plus concis

}

//  connexion à la base de données
connectMongoDB();

//  servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {

  // pour les fichiers statiques depuis le dossier 'backend/src/public' apres build
  app.use(express.static(path.join(__dirname, 'public'))); 

  //  route pour servir index.html de l'application vue 3 frontend pour toutes les autres requêtes (hors API)
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html')); 

  });

} else {

  //  acceuil
  app.get('/', (req: Request, res: Response) => {
    res.send('API IS RUNNING 🚀...');
  });

}

// Routes API
app.use('/api/analytics', analyticsRoutes); 
app.use('/api/products', productRoutes); 

//  middleware de gestion des erreurs

// gère les routes non trouvées
app.use(notFound); 
//  gère les erreurs personnalisées (par exemple, erreurs de validation, DB, etc.)
app.use(errorHandler); 

//  démarrage du serveur
//  utiliser le port depuis les variables d'environnement ou le port5000 par défaut et afficher un message à la console
const port: string | number = process.env.PORT || 5000; 

app.listen(port, () => {

  console.log(`🚀 Serveur en cours d'exécution sur le port ${port}`); 

});
