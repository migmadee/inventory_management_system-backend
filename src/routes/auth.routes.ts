import { Router } from 'express'
import { register,login,getProfile, updateUser } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/profile', authenticate, getProfile)
router.put('/profile/:id', authenticate, updateUser)

export default router