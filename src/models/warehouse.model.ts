import { Schema, model, Document } from 'mongoose';
import { IWarehouse } from '../types/inventory';



const WarehouseSchema = new Schema<IWarehouse>({
  name: String,
  location: String,
  capacity: Number,
});

export default model<IWarehouse>('Warehouse', WarehouseSchema);
