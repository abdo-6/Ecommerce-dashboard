import { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  dateAdded: Date;
}