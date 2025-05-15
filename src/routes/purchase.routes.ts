import { Router } from "express"
import { createPurchase, deletePurchase, getPurchaseById, getPurchases, updatePurchase } from "../controllers/purchase.controller";

const router = Router()

//GET/api/v1/purchase - get all purchase
router.get('/', getPurchases)

//GET/api/v1/purchase - get purchase by id
router.get('/:id', getPurchaseById )

//POST/api/v1/purchase- create new purchase
router.post('/',createPurchase)

//PUT/api/v1/purchase - upadte purchase
router.put('/:id',  updatePurchase )

//DELETE/api/v1/purchase - delete purchase
router.delete('/:id', deletePurchase )

export default router

