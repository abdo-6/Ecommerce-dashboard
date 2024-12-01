import mongoose, { Schema, Document } from 'mongoose';
import {IProduct} from '../types/product';


const productSchema = new Schema<IProduct>({   
  name: { type: String, required: true },  
  category: { type: String, required: true },  
  price: { type: Number, required: true },  
  dateAdded: { type: Date, default: Date.now },   
});

export default mongoose.model<IProduct>('Product', productSchema);   
