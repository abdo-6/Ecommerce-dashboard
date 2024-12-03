import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import analyticsRoutes from './routes/analyticsRoutes';
import productRoutes from './routes/productRoutes';
import { connectMongoDB } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';
import express, { Request, Response, Application } from 'express';

dotenv.config(); // Load environment variables

const app: Application = express();

// CORS configuration
if (process.env.NODE_ENV === 'production') {
  const corsOptions = {
    origin: 'https://ecommerce-dashboard-i3dx.onrender.com',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.use(cors(corsOptions));
} else {
  app.use(cors());
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
connectMongoDB();

// API Routes
app.use('/analytics', analyticsRoutes);
app.use('/products', productRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // API Routes
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/products', productRoutes);
  
  app.use(express.static(path.join(__dirname, 'public')));

  // Serve the frontend's index.html for non-API routes
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
} else {
    // API Routes
    app.use('/analytics', analyticsRoutes);
    app.use('/products', productRoutes);
  
    // Simple route for development
    app.get('/', (req: Request, res: Response) => {
      res.send('API IS RUNNING 🚀...');
    });
  }

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const port: string | number = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
