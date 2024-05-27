import { DataTypes } from 'sequelize'
import { sequelize } from '../database/database.js'
import { User } from './user.model.js'
import { SavingPlan } from './saving_day.model.js'

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
    savings: {
        type: DataTypes.JSONB,
        allowNull: false
    }
}, {
    timestamps: false
})

User.hasMany(UserSaving, { foreignKey: 'user_id' })
UserSaving.belongsTo(User, { foreignKey: 'user_id' })

SavingPlan.hasMany(UserSaving, { foreignKey: 'saving_plan_id' })
UserSaving.belongsTo(SavingPlan, { foreignKey: 'saving_plan_id' })