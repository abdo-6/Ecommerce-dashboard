import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
  productId: mongoose.Schema.Types.ObjectId;  // Correction ici
  quantity: number;
  saleDate: Date;
}