import mongoose, { Schema, Document } from 'mongoose';
import {ISale} from '../types/sale';


const saleSchema = new Schema<ISale>({ 
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  
  quantity: { type: Number, required: true },   
  saleDate: { type: Date, default: Date.now },  
});

export default mongoose.model<ISale>('Sale', saleSchema); 
