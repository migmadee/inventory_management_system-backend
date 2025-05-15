import { Router } from "express"
import { createUser, updateUser } from "../controllers/user.controller"
import { getUserById } from '../controllers/user.controller'

const router = Router()

//GET/api/v1/user - get user Id by Id
router.get('/:id', getUserById)

//POST/api/v1/user - create a new user
router.post('/', createUser)

//PATCH/api/v1/user -update user
router.patch('/:id', updateUser)

export default router