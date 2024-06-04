import { Router } from 'express'
import { authRequired } from '../middlewares/checkToken.js'
import {
    createSavingsPlan,
    getPlan,
    getPlans
} from '../controllers/saving.controller.js'

const router = Router()

router.post('/saving', authRequired, createSavingsPlan)
router.get('/saving/:id', authRequired, getPlan)
router.get('/savings', authRequired, getPlans)

export default router