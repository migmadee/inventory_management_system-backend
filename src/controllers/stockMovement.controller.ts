import { Request, Response } from "express"
import StockMovement from '../models/stockmovement.model'
import { IStockMovement } from "../types/inventory"
import { handleError, isValidObjectId } from "../utils/utiils"

// Get all stock movements
export const getStockMovements = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stockMovements = await StockMovement.find().lean()
    res.status(200).json(stockMovements)
  } catch (error) {
    handleError(res, error)
  }
}

// Get stock movement by ID
export const getStockMovementById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return

    const stockMovement = await StockMovement.findById(id).lean()
    if (!stockMovement) {
      res.status(404).json({ message: "Stock movement not found" })
      return
    }

    res.status(200).json(stockMovement)
  } catch (error) {
    handleError(res, error)
  }
}

// Create new stock movement
export const createStockMovement = async (
  req: Request<{}, {}, IStockMovement>,
  res: Response
): Promise<void> => {
  try {
    const { product, source, destination, quantity, date } = req.body

    if (!product || !source || !destination || quantity === undefined || !date) {
      res.status(400).json({ message: "Missing required fields" })
      return
    }

    const stockMovement = new StockMovement({ product, source, destination, quantity, date })
    const savedStockMovement = await stockMovement.save()

    const { _id, product: stockmovementProduct, source: stockmovementSource, destination: stockmovementDestination, quantity: stockmovementQuantity, date: stockmovementDate } = savedStockMovement
    res.status(201).json({ _id, product: stockmovementProduct, source: stockmovementSource, destination: stockmovementDestination, quantity: stockmovementQuantity, date: stockmovementDate })
  } catch (error) {
    handleError(res, error)
  }
}

// Update stock movement
export const updateStockMovement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { product, source, destination, quantity, date } = req.body

    if (!isValidObjectId(id, res)) return

    if (!product && !source && !destination && quantity === undefined && !date) {
      res.status(400).json({ message: "No update fields provided" })
      return
    }

    const updateData: Partial<IStockMovement> = {}
    if (product) updateData.product = product
    if (source) updateData.source = source
    if (destination) updateData.destination = destination
    if (quantity !== undefined) updateData.quantity = quantity
    if (date) updateData.date = date

    const updatedStockMovement = await StockMovement.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).lean()

    if (!updatedStockMovement) {
      res.status(404).json({ message: "Stock movement not found" })
      return
    }

    res.status(200).json(updatedStockMovement)
  } catch (error) {
    handleError(res, error)
  }
}

// Delete stock movement
export const deleteStockMovement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return

    const deletedStockMovement = await StockMovement.findByIdAndDelete(id).lean()
    if (!deletedStockMovement) {
      res.status(404).json({ message: "Stock movement not found" })
      return
    }

    res.status(200).json({ message: "Stock movement deleted successfully" })
  } catch (error) {
    handleError(res, error)
  }
}