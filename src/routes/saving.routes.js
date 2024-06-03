import { Router } from 'express'
import { authRequired } from '../middlewares/checkToken.js'
import { createSavingsPlan } from '../controllers/saving.controller.js'

const router = Router()

router.post('/saving', authRequired, createSavingsPlan)

export default router