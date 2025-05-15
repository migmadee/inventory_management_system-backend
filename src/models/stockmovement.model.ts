import { Schema, model } from 'mongoose';
import { IStockMovement } from '../types/inventory';



const StockMovementSchema = new Schema<IStockMovement>({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  source: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
  destination: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
  quantity: Number,
  date: { type: Date, default: Date.now },
});
export default model<IStockMovement>('StockMovement', StockMovementSchema);
