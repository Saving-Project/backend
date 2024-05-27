import { Router } from 'express'
import { register } from '../controllers/user.controller'

const router = Router()

router.post('/', register)

export default router