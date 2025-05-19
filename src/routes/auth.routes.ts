import { Router } from 'express'
import { register,login,getProfile, updateUser } from '../controllers/auth.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'

const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/profile', authenticate, getProfile)
router.put('/profile/:id', authenticate, updateUser)

//Only admin can access this
router.get('/admin-data', authenticate, authorize(['admin']),
(_req, res) => {
    res.status(200).json({ message: ' admin- only content' })
})
//Only manager or admin can access this
router.get(
    '/manager-data',
    authenticate,
    authorize(['manager']),
    (_req, res) => {
        res.status(200).json({ message: 'Manager/Admin content' })
    }
)
router.get('/staff-data', authenticate, authorize(['staff']),
(_req, res) => {
    res.status(200).json({ message: 'Staff/manager/Admin content' })
})
export default router