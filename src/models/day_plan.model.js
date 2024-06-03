import { DataTypes } from 'sequelize'
import { sequelize } from '../database/database.js'
import { Plan } from './plan.model.js'
import { SavingDay } from './saving_day.model.js'

export const DayPlan = sequelize.define('day_plans', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'plans',
            key: 'id'
        }
    },
    saving_day_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'saving_days',
            key: 'id'
        }
    }
}, {
    timestamps: false
})

Plan.hasMany(DayPlan, { foreignKey: 'user_id' })
DayPlan.belongsTo(Plan, { foreignKey: 'user_id' })

SavingDay.hasMany(DayPlan, { foreignKey: 'saving_day_id' })
DayPlan.belongsTo(Plan, { foreignKey: 'saving_day_id' })