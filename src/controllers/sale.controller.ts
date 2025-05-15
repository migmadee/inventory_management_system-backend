import { Request, Response } from 'express'
import { isValidObjectId, handleError } from '../utils/utiils'
import Sale from '../models/sale.model'
import { ISale } from '../types/inventory'

// Get all sales
export const getSales = async (_req: Request, res: Response): Promise<void> => {
  try {
    const sales = await Sale.find().lean()
    res.status(200).json(sales)
  } catch (error) {
    handleError(res, error)
  }
}

// Create a new sale
export const createSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer, date, totalAmount, status } = req.body

    const sale = new Sale({ customer, date, totalAmount, status })
    const savedSale = await sale.save()
    res.status(201).json(savedSale)
  } catch (error) {
    handleError(res, error)
  }
}

// Get sale by ID
export const getSaleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return

    const sale = await Sale.findById(id).lean()
    if (!sale) {
      res.status(404).json({ message: 'Sale not found' })
      return
    }

    res.status(200).json(sale)
  } catch (error) {
    handleError(res, error)
  }
}

// Update sale
export const updateSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { customer, date, totalAmount, status } = req.body

    if (!isValidObjectId(id, res)) return

    const updateData: Partial<ISale> = {}
    if (customer) updateData.customer = customer
    if (date) updateData.date = date
    if (totalAmount) updateData.totalAmount = totalAmount
    if (status) updateData.status = status

    const updatedSale = await Sale.findByIdAndUpdate(id, updateData, { new: true }).lean()
    if (!updatedSale) {
      res.status(404).json({ message: 'Sale not found' })
      return
    }

    res.status(200).json(updatedSale)
  } catch (error) {
    handleError(res, error)
  }
}

// Delete sale
export const deleteSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return

    const deletedSale = await Sale.findByIdAndDelete(id).lean()
    if (!deletedSale) {
      res.status(404).json({ message: 'Sale not found' })
      return
    }

    res.status(200).json({ message: 'Sale deleted successfully' })
  } catch (error) {
    handleError(res, error)
  }
}