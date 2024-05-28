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

export const updateSavingStatus = async (req, res) => {
    const userId = req.user.id
    const { day } = req.body

    try {
        const userSaving = await UserSaving.findOne({
            where: { user_id: userId }
        })

        if (!userSaving) return res.status(404).json({ message: 'Plan de ahorro no encontrado' })
        
        const savings = userSaving.savings
        const currentDate = new Date()

        const index = savings.findIndex(d => d.saving_day_id === day)
        console.log(index)

        if (index === -1) {
            return res.status(404).json({ message: 'Plan de ahorro no encontrado' })
        }
        
        if (savings[index].enabled && (new Date(savings[index].date).toDateString() === currentDate.toDateString())) {
            savings[index].saved = true

            if (index + 1 < savings.length) {
                savings[index + 1].enabled = true
            }

            if (index + 2 < savings.length) {
                const nextDate = new Date(savings[index + 1].date)
                if (nextDate.toDateString() === currentDate.toDateString()) {
                    savings[index +2].enabled = true
                }
            }

            await userSaving.update({ savings })

            return res.status(200).json(savings)
        } else {
            return res.status(500).json('No se pudo marcar el día como ahorrado')
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}