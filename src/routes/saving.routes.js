import { Router } from 'express'
import { authRequired } from '../middlewares/checkToken.js'
import {
    createSavingsPlan,
    getPlan,
    getPlans,
    markDayAsSaved
} from '../controllers/saving.controller.js'

const router = Router()

router.post('/saving', authRequired, createSavingsPlan)
router.get('/saving/:id', authRequired, getPlan)
router.get('/savings', authRequired, getPlans)
router.put('/saving/:id', authRequired, markDayAsSaved)

export default router