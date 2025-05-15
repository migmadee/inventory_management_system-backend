import { Router } from "express"
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/category.controller";

const router = Router()
//GET/api/v1/category - get all categories
router.get('/', getCategories)

//GET/api/v1/category - get category by id
router.get('/:id', getCategoryById)

//POST/api/v1/category - create new category
router.post('/', createCategory)

//PUT/api/v1/category - update cataegory
router.put('/:id', updateCategory )

//DELETE/api/v1/category- delete category
router.delete('/:id', deleteCategory )

export default router

