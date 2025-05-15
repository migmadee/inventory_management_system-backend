import { Schema, model } from 'mongoose';
import { IStock } from '../types/inventory';



const StockSchema = new Schema<IStock>({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  warehouse: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
  quantity: Number,
});

export default model<IStock>('Stock', StockSchema);
