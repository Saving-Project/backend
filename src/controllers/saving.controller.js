import { Plan } from '../models/plan.model.js'
import { DayPlan } from '../models/day_plan.model.js'
import { SavingDay } from '../models/saving_day.model.js'
import { sequelize } from '../database/database.js'

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

export const markDayAsSaved = async (req, res) => {
    const { id } = req.params
    const user_id = req.user.id
    const { day } = req.body

    try {
        console.log(`Id del plan: ${id} - Id del usuario: ${user_id}`)
        const plan = await Plan.findOne({
            where: {
                id,
                user_id
            },
            include: [{
                model: DayPlan,
                include: [SavingDay],
                order: [['date', 'ASC']]
            }]
        })

        if (!plan) return res.status(404).json({ message: 'Plan no encontrado' })
        
        const dayPlan = plan.day_plans.find(dp => dp.id === parseInt(day))
        if (!dayPlan) return res.status(400).json({ message: 'DayPlan not found' })
        
        if (dayPlan.saved) return res.status(400).json({ message: 'Este día ya fue guardado' })

        const currentDate = new Date().toISOString().split('T')[0];
        if (dayPlan.date !== currentDate) {
            return res.status(400).json({ message: 'No puedes guardar este día todavía' });
        }
        
        const transaction = await sequelize.transaction()

        try {
            dayPlan.saved = true
            await dayPlan.save({ transaction })

            plan.total_saving = parseInt(plan.total_saving) + dayPlan.saving_day.amount
            await plan.save({ transaction })
            
            const nextDayPlan = plan.day_plans.find(dp => dp.date > dayPlan.date)

            if (nextDayPlan && nextDayPlan.date === new Date().toISOString().split('T')[0]) {
                nextDayPlan.enabled = true
                await nextDayPlan.save({ transaction })
            }

            await transaction.commit()

            res.status(200).json({ message: 'Day marked as saved', plan })
        } catch (error) {
            await transaction.rollback()
            console.error('Error marking day as saved: ', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

export const resetPlan = async (req, res) => {
    const { id } = req.params
    const user_id = req.user.id

    try {
        const plan = await Plan.findOne({
            where: {
                id,
                user_id
            },
            include: [{
                model: DayPlan,
                include: [SavingDay],
                order: [['id', 'ASC']]
            }]
        })

        if (!plan) return res.status(404).json({ message: 'Plan no encontrado' })
        
        const transaction = await sequelize.transaction()

        try {
            const currentDate = new Date()
            let newDate = new Date(currentDate)

            const dayPlans = plan.day_plans.sort((a, b) => a.id - b.id)

            for (let i = 0; i < dayPlans.length; i++) {
                const dayPlan = plan.day_plans[i]
                dayPlan.saved = false
                dayPlan.enabled = i === 0
                dayPlan.date = new Date(newDate)

                await dayPlan.save({ transaction })

                newDate.setDate(newDate.getDate() + 1)
            }

            plan.total_saving = 0
            await plan.save({ transaction })

            await transaction.commit()

            res.status(200).json({
                message: 'Plan reiniciado con éxito',
                plan
            })
        } catch (error) {
            await transaction.rollback()
            console.error('Error reiniciando el plan: ', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const deletePlan = async (req, res) => {
    const { id } = req.params
    const user_id = req.user.id

    try {
        const plan = await Plan.findOne({
            where: {
                id,
                user_id
            },
            include: [{
                model: DayPlan,
                include: [SavingDay]
            }]
        })

        if (!plan) return res.status(404).json({ message: 'Plan no encontrado' })
        
        const transaction = await sequelize.transaction()

        try {
            await DayPlan.destroy({
                where: {
                    plan_id: id
                },
                transaction
            })

            await plan.destroy({ transaction })

            await transaction.commit()

            res.status(200).json({ message: 'Plan eliminado con éxito' })
        } catch (error) {
            await transaction.rollback()
            console.error('Error eliminando el plan: ', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const completePlan = async (req, res) => {
    const { id } = req.params
    const user_id = req.user.id

    try {
        const plan = await Plan.findOne({
            where: {
                id,
                user_id
            },
            include: [
                {
                    model: DayPlan,
                    include: [SavingDay]
                }
            ]
        })
        
        if (!plan) return res.status(404).json({ message: 'Plan no encontrado' })
        
        if (plan.total_saving >= 1000000) {
            plan.completed = true
            await plan.save()
            res.status(200).json({
                message: 'Plan completado con éxito',
                plan
            })
        }
    } catch (error) {
        return res.status(500).json(error)
    } 
}