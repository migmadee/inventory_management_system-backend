import { Schema, model, Document } from 'mongoose';
import { ISale } from '../types/inventory';



const SaleSchema = new Schema<ISale>({
  customer: String,
  date: { type: Date, default: Date.now },
  totalAmount: Number,
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
});

export default model<ISale>('Sale', SaleSchema);
