import { Op } from 'sequelize'
import { SavingPlan } from '../models/saving_day.model.js'
import { UserSaving } from '../models/user_saving.model.js'

export const createSavingPlan = async (req, res) => {
    const userId = req.user.id

    try {
        const savingDays = await SavingPlan.findAll({
            where: {
                day: {
                    [Op.between]: [1, 200]
                }
            },
            order: [['day', 'ASC']]
        })

        const startDate = new Date()
        const savings = savingDays.map((day, index) => ({
            saving_day_id: day.id,
            saved: false,
            date: new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000),
            enabled: index === 0
        }))

        const userSaving = await UserSaving.create({
            user_id: userId,
            savings: savings
        })

        return res.status(200).json(userSaving)
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const getSavingDays = async (req, res) => {
    const userId = req.user.id
    try {
        const userSaving = await UserSaving.findOne({
            where: { user_id: userId }
        })

        if (!userSaving) return res.status(404).json({ message: 'Plan de ahorro no encontrado' })
        
        const savings = userSaving.savings
        const savingDaysIds = savings.map(saving => saving.saving_day_id)

        const savingDays = await SavingPlan.findAll({
            where: {
                id: {
                    [Op.in]: savingDaysIds
                }
            }
        })

        const amountMap = {}
        savingDays.forEach(day => {
            amountMap[day.id] = day.amount
        })

        const savingsWithAmounts = savings.map(saving => ({
            ...saving,
            amount: amountMap[saving.saving_day_id] || 0
        }))

        return res.status(200).json(savingsWithAmounts)
    } catch (error) {
        return res.status(500).json(error)
    }
}