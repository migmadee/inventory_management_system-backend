import { Router } from "express"
import { createSupplier, deleteSupplier, getSupplierById, getSuppliers, updateSupplier } from "../controllers/supplier.controller";

const router = Router()

//GET/api/v1/user - get user Id by Id
router.get('/', getSuppliers )
router.get('/:id', getSupplierById )
router.post('/', createSupplier );
router.put('/:id', updateSupplier  )
router.delete('/:id', deleteSupplier)

export default router

