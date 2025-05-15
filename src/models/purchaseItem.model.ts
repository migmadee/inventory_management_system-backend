import { Schema, model} from 'mongoose';
import { IPurchaseItem } from '../types/inventory';


const PurchaseItemSchema = new Schema<IPurchaseItem>({
  purchase: { type: Schema.Types.ObjectId, ref: 'Purchase' },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  price: Number,
});

export default model<IPurchaseItem>('PurchaseItem', PurchaseItemSchema);
