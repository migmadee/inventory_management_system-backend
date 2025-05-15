import { Router } from 'express'

import { createSaleItem, deleteSaleItem, getSaleItemById, getSaleItems, updateSaleItem } from '../controllers/saleItem.controller'

const router = Router()

router.get('/', getSaleItems)
router.get('/:id', getSaleItemById)
router.post('/', createSaleItem)
router.put('/:id', updateSaleItem)
router.delete('/:id', deleteSaleItem)

export default router