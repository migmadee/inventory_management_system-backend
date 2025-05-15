import { Router } from 'express';
import { createPurchaseItem, deletePurchaseItem, getPurchaseItemById, getPurchaseItems, updatePurchaseItem } from '../controllers/purchaseItem.controller';

const router = Router();
//GET/api/v1/purchaseItem - get all purchaseItem
router.get('/', getPurchaseItems)

//GET/api/v1/purchaseItem- get purchaseItem by id
router.get('/:id', getPurchaseItemById)

// POST/api/v1/purchaseItem - craete purchaseItem
router.post('/', createPurchaseItem)

//PUT/api/v1/purchaseItem- update PurchaseItem
router.put('/:id', updatePurchaseItem)

//DELETE/api/v1/purcahseItem- delete purchaseItem
router.delete('/:id', deletePurchaseItem)

export default router;
