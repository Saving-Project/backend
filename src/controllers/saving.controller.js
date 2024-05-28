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