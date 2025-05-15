import express from 'express'
import {
  getWarehouses,
  createWarehouse,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse
} from '../controllers/warehouse.controller'

const router = express.Router()

// GET /api/warehouses - Get all warehouses
router.get('/', getWarehouses)

// POST /api/warehouses - Create a new warehouse
router.post('/', createWarehouse)

// GET /api/warehouses/:id - Get a warehouse by ID
router.get('/:id', getWarehouseById)

// PUT /api/warehouses/:id - Update a warehouse by ID
router.put('/:id', updateWarehouse)

// DELETE /api/warehouses/:id - Delete a warehouse by ID
router.delete('/:id', deleteWarehouse)

export default router