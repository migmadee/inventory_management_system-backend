import { Router } from "express"
import {createProduct, getProductById, getProducts, updateProduct, deleteProduct} from '../controllers/product.controller'

const router = Router()

//GET/api/v1/product - get all products
router.get('/', getProducts)

//GET/api/v1/product - get product by id
router.get('/:id', getProductById)

//POST/api/v1/product - create new product
router.post('/', createProduct)

//PUT/api/v1/product- update product
router.put('/:id', updateProduct )

//DELETE/api/v1/product - delete product
router.delete('/:id', deleteProduct)

export default router