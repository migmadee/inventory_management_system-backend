import { Schema, model,  } from 'mongoose';
import { IProduct } from '../types/inventory';

const ProductSchema = new Schema<IProduct>({
  name: String,
  description: String,
  sku: { type: String, unique: true },
  price: Number,
  quantity: Number,
});

export default model<IProduct>('Product', ProductSchema);
