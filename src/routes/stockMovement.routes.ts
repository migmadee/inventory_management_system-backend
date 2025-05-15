import { Router } from "express"
import { createStockMovement, deleteStockMovement, getStockMovementById, getStockMovements, updateStockMovement } from "../controllers/stockMovement.controller"

const router = Router()

// GET /api/stockmovement - Get all stockmovement
router.get('/', getStockMovements)

// GET /api/stockmovement/:id - Get stockmovement by Id
router.get('/:id', getStockMovementById )

// POST /api/stockmovement - Create a new stockmovement
router.post('/', createStockMovement)

// PUT /api/stockmovement/:id - Update stockmovement by Id
router.put('/:id', updateStockMovement)


// DELETE /api/stockmovement/:id - Delete stockmovement by Id
router.delete('/:id', deleteStockMovement)


export default router