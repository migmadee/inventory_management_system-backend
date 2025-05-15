import { Router } from 'express'
import { getStocks, createStock, getStockById, updateStock, deleteStock } from '../controllers/stock.controller'

const router = Router()

router.get('/', getStocks)
router.post('/', createStock)
router.get('/:id', getStockById)
router.put('/:id', updateStock)
router.delete('/:id', deleteStock)

export default router