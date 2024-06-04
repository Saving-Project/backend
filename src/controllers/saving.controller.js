import { Plan } from '../models/plan.model.js'
import { DayPlan } from '../models/day_plan.model.js'
import { SavingDay } from '../models/saving_day.model.js'

export const createSavingsPlan = async (req, res) => {
    const user_id = req.user.id
    const { description } = req.body || ''
    
    try {
        const newPlan = await Plan.create({
            user_id,
            description
        })

        const today = new Date()
        let dayPlansData = []

        for (let i = 0; i < 200; i++) {
            dayPlansData.push({
                plan_id: newPlan.id,
                saving_day_id: i + 1,
                saved: false,
                enabled: i === 0,
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
            })
        }

        const daysAsigned = await DayPlan.bulkCreate(dayPlansData)

        res.status(200).json({
            message: 'Plan creado',
            newPlan,
            daysAsigned
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const getPlan = async (req, res) => {
    const user_id = req.user.id
    const { id } = req.params

    try {
        const plan = await Plan.findOne({
            where: {
                id,
                user_id
            },
            include: [{
                model: DayPlan,
                include: [{
                    model: SavingDay,
                    attributes: ['day', 'amount']
                }],
                order: [['date', 'ASC']]
            }]
        })

        if (!plan) return res.status(404).json({ message: 'Plan no encontrado' })
        
        return res.status(200).json(plan)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

export const getPlans = async (req, res) => {
    const user_id = req.user.id

    try {
        const plans = await Plan.findAll({
            where: { user_id }
        })

        if (!plans) return res.status(404).json({ message: 'Planes no encontrados' })
        
        return res.status(200).json(plans)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}