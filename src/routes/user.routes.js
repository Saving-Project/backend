import { Router } from 'express'
import { authRequired } from '../middlewares/checkToken.js'
import {
    getInfo,
    getSavings,
    login,
    register
} from '../controllers/user.controller.js'

const router = Router()

router.post('/user', register)
router.post('/login', login)
router.get('/user', authRequired, getInfo)
router.get('/user/savings', authRequired, getSavings)

export default router