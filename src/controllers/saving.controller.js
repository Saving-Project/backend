import { Plan } from '../models/plan.model.js'
import { DayPlan } from '../models/day_plan.model.js'

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
        console.error(error)
        return res.status(500).json(error)
    }
}