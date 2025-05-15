import { Request, Response } from 'express'
import { isValidObjectId, handleError } from '../utils/utiils'
import SaleItem from '../models/saleItem.model'
import { ISaleItem } from '../types/inventory'

// Get all sale items
export const getSaleItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await SaleItem.find()
      .populate('sale', '_id') // Optional: Populate Sale ID
      .populate('product', 'name price') // Optional: Populate product name and price
      .lean()

    res.status(200).json(items)
  } catch (error) {
    handleError(res, error)
  }
}

// Create a sale item
export const createSaleItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sale, product, quantity, price } = req.body

    if (!isValidObjectId(sale, res)) return
    if (!isValidObjectId(product, res)) return

    const saleItem = new SaleItem({ sale, product, quantity, price })
    const saved = await saleItem.save()

    res.status(201).json(saved)
  } catch (error) {
    handleError(res, error)
  }
}

// Get a sale item by ID
export const getSaleItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return

    const item = await SaleItem.findById(id)
      .populate('sale', '_id')
      .populate('product', 'name price')
      .lean()

    if (!item) {
      res.status(404).json({ message: 'Sale item not found' })
      return
    }

    res.status(200).json(item)
  } catch (error) {
    handleError(res, error)
  }
}

// Update a sale item
export const updateSaleItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { sale, product, quantity, price } = req.body

    if (!isValidObjectId(id, res)) return
    if (sale && !isValidObjectId(sale, res)) return
    if (product && !isValidObjectId(product, res)) return

    const updateData: Partial<ISaleItem> = {}
    if (sale) updateData.sale = sale
    if (product) updateData.product = product
    if (quantity !== undefined) updateData.quantity = quantity
    if (price !== undefined) updateData.price = price

    const updated = await SaleItem.findByIdAndUpdate(id, updateData, { new: true }).lean()

    if (!updated) {
      res.status(404).json({ message: 'Sale item not found' })
      return
    }

    res.status(200).json(updated)
  } catch (error) {
    handleError(res, error)
  }
}

// Delete a sale item
export const deleteSaleItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return

    const deleted = await SaleItem.findByIdAndDelete(id).lean()
    if (!deleted) {
      res.status(404).json({ message: 'Sale item not found' })
      return
    }

    res.status(200).json({ message: 'Sale item deleted successfully' })
  } catch (error) {
    handleError(res, error)
  }
}