import { Schema, model } from 'mongoose';
import { ICategory } from '../types/inventory';



const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: String,
})

export default model<ICategory>('Category', CategorySchema)
