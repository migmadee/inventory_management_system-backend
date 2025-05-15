import { Request, Response } from 'express'
import Warehouse from '../models/warehouse.model'
import { IWarehouse } from '../types/inventory'
import { isValidObjectId, handleError } from '../utils/utiils'

// Get all warehouses
export const getWarehouses = async (_req: Request, res: Response): Promise<void> => {
  try {
    const warehouses = await Warehouse.find().lean()
    res.status(200).json(warehouses)
  } catch (error) {
    handleError(res, error)
  }
}

// Create a new warehouse
export const createWarehouse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, location, capacity } = req.body

    if (!name || !location || capacity === undefined) {
      res.status(400).json({ message: 'Name, location, and capacity are required' })
      return
    }

    const warehouse = new Warehouse({ name, location, capacity })
    const saved = await warehouse.save()

    res.status(201).json(saved)
  } catch (error) {
    handleError(res, error)
  }
}

// Get a warehouse by ID
export const getWarehouseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return

    const warehouse = await Warehouse.findById(id).lean()

    if (!warehouse) {
      res.status(404).json({ message: 'Warehouse not found' })
      return
    }

    res.status(200).json(warehouse)
  } catch (error) {
    handleError(res, error)
  }
}

// Update a warehouse
export const updateWarehouse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name, location, capacity } = req.body

    if (!isValidObjectId(id, res)) return

    const updateData: Partial<IWarehouse> = {}
    if (name) updateData.name = name
    if (location) updateData.location = location
    if (capacity !== undefined) updateData.capacity = capacity

    const updated = await Warehouse.findByIdAndUpdate(id, updateData, { new: true }).lean()

    if (!updated) {
      res.status(404).json({ message: 'Warehouse not found' })
      return
    }

    res.status(200).json(updated)
  } catch (error) {
    handleError(res, error)
  }
}

// Delete a warehouse
export const deleteWarehouse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id, res)) return

    const deleted = await Warehouse.findByIdAndDelete(id).lean()
    if (!deleted) {
      res.status(404).json({ message: 'Warehouse not found' })
      return
    }

    res.status(200).json({ message: 'Warehouse deleted successfully' })
  } catch (error) {
    handleError(res, error)
  }
}