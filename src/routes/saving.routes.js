import { Router } from 'express'
import { authRequired } from '../middlewares/checkToken.js'
import { createSavingPlan } from '../controllers/saving.controller.js'

const router = Router()

router.post('/saving', authRequired, createSavingPlan)

export default router