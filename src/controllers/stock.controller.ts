import { Request, Response } from "express"
import Stock from '../models/stock.model'
import { IStock } from "../types/inventory"
import { handleError, isValidObjectId } from "../utils/utiils"

// Get all stock
export const getStocks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stocks = await Stock.find().lean()
    res.status(200).json(stocks)
  } catch (error) {
    handleError(res, error)
  }
}

// Get stock by ID
export const getStockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return

    const stock = await Stock.findById(id).lean()
    if (!stock) {
      res.status(404).json({ message: "Stock not found" })
      return
    }

    res.status(200).json(stock)
  } catch (error) {
    handleError(res, error)
  }
}

// Create new stock
export const createStock = async (
  req: Request<{}, {}, IStock>,
  res: Response
): Promise<void> => {
  try {
    const { product, warehouse, quantity } = req.body

    if (!product || !warehouse || quantity === undefined) {
      res.status(400).json({ message: "Missing required fields" })
      return
    }

    const stock = new Stock({ product, warehouse, quantity })
    const savedStock = await stock.save()

    const { _id, product: stockProduct, warehouse: stockWarehouse, quantity: stockQuantity } = savedStock
    res.status(201).json({ _id, product: stockProduct, warehouse: stockWarehouse, quantity: stockQuantity })
  } catch (error) {
    handleError(res, error)
  }
}

// Update stock
export const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { product, warehouse, quantity } = req.body

    if (!isValidObjectId(id, res)) return

    if (!product && !warehouse && quantity === undefined) {
      res.status(400).json({ message: "No update fields provided" })
      return
    }

    const updateData: Partial<IStock> = {}
    if (product) updateData.product = product
    if (warehouse) updateData.warehouse = warehouse
    if (quantity !== undefined) updateData.quantity = quantity

    const updatedStock = await Stock.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).lean()

    if (!updatedStock) {
      res.status(404).json({ message: "Stock not found" })
      return
    }

    res.status(200).json(updatedStock)
  } catch (error) {
    handleError(res, error)
  }
}

// Delete stock
export const deleteStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return

    const deletedStock = await Stock.findByIdAndDelete(id).lean()
    if (!deletedStock) {
      res.status(404).json({ message: "Stock not found" })
      return
    }

    res.status(200).json({ message: "Stock deleted successfully" })
  } catch (error) {
    handleError(res, error)
  }
}