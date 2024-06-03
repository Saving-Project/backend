import { Router } from 'express'
import { authRequired } from '../middlewares/checkToken.js'
import {
    getInfo,
    login,
    register
} from '../controllers/user.controller.js'

const router = Router()

router.post('/user', register)
router.post('/login', login)
router.get('/user', authRequired, getInfo)

export default router