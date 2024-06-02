import { Router } from 'express'
import { authRequired } from '../middlewares/checkToken.js'
import {
    createSavingPlan,
    getSavingDays,
    updateSavingStatus
} from '../controllers/saving.controller.js'

const router = Router()

router.post('/saving', authRequired, createSavingPlan)
router.get('/saving', authRequired, getSavingDays)
router.put('/saving/:id', authRequired, updateSavingStatus)

export default router