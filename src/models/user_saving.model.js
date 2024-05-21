import { DataTypes } from 'sequelize'
import { sequelize } from '../database/database.js'
import { User } from './user.model.js'
import { SavingPlan } from './saving_plan.model.js'

export const UserSaving = sequelize.define('user_savings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    saving_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'saving_plans',
            key: 'id'
        }
    },
    saved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
})

User.hasMany(UserSaving, { foreignKey: 'user_id' })
UserSaving.belongsTo(User, { foreignKey: 'user_id' })

SavingPlan.hasMany(UserSaving, { foreignKey: 'saving_plan_id' })
UserSaving.belongsTo(SavingPlan, { foreignKey: 'saving_plan_id' })