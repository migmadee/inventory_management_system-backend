import { Request, Response } from 'express'
import { isValidObjectId, handleError } from '../utils/utiils'
import PurchaseItem from '../models/purchaseItem.model'
import { IPurchaseItem } from '../types/inventory'

// Get all purchase items
export const getPurchaseItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await PurchaseItem.find()
      .populate('purchase', '_id')
      .populate('product', 'name')
      .lean()
    res.status(200).json(items)
  } catch (error) {
    handleError(res, error)
  }
}

// Create a new purchase item
export const createPurchaseItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { purchase, product, quantity, price } = req.body

    if (!isValidObjectId(purchase, res) || !isValidObjectId(product, res)) return

    const item = new PurchaseItem({ purchase, product, quantity, price })
    const saved = await item.save()
    res.status(201).json(saved)
  } catch (error) {
    handleError(res, error)
  }
}

// Get item by ID
export const getPurchaseItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return

    const item = await PurchaseItem.findById(id)
      .populate('purchase')
      .populate('product')
      .lean()

    if (!item) {
      res.status(404).json({ message: 'Purchase item not found' })
      return
    }

    res.status(200).json(item)
  } catch (error) {
    handleError(res, error)
  }
}

// Update item
export const updatePurchaseItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { purchase, product, quantity, price } = req.body

    if (!isValidObjectId(id, res)) return

    const updateData: Partial<IPurchaseItem> = {}
    if (purchase && isValidObjectId(purchase, res)) updateData.purchase = purchase
    if (product && isValidObjectId(product, res)) updateData.product = product
    if (quantity) updateData.quantity = quantity
    if (price) updateData.price = price

    const updated = await PurchaseItem.findByIdAndUpdate(id, updateData, { new: true }).lean()

    if (!updated) {
      res.status(404).json({ message: 'Purchase item not found' })
      return
    }

    res.status(200).json(updated)
  } catch (error) {
    handleError(res, error)
  }
}

// Delete item
export const deletePurchaseItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return

    const deleted = await PurchaseItem.findByIdAndDelete(id).lean()
    if (!deleted) {
      res.status(404).json({ message: 'Purchase item not found' })
      return
    }

    res.status(200).json({ message: 'Purchase item deleted successfully' })
  } catch (error) {
    handleError(res, error)
  }
}