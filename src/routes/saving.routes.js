import { Router } from 'express'
import { authRequired } from '../middlewares/checkToken.js'
import {
    completePlan,
    createSavingsPlan,
    deletePlan,
    getPlan,
    getPlans,
    markDayAsSaved,
    resetPlan
} from '../controllers/saving.controller.js'

const router = Router()

router.post('/saving', authRequired, createSavingsPlan)
router.get('/saving/:id', authRequired, getPlan)
router.get('/savings', authRequired, getPlans)
router.put('/saving/:id', authRequired, markDayAsSaved)
router.put('/saving/:id/reset', authRequired, resetPlan)
router.put('/saving/:id/complete', authRequired, completePlan)
router.delete('/saving/:id', authRequired, deletePlan)

export default router