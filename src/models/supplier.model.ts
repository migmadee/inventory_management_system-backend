import { Schema, model } from 'mongoose'
import { ISupplier } from '../types/inventory'



const SupplierSchema = new Schema<ISupplier>({
  name: String,
  contactInfo: String,
  address: String,
})

export default model<ISupplier>('Supplier', SupplierSchema)
