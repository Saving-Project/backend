import { DataTypes } from 'sequelize'
import { sequelize } from '../database/database.js'
import { User } from './user.model.js'

export const Plan = sequelize.define('plans', {
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
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    total_saving: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    starts_in: {
        type: DataTypes.DATEONLY,
    },
    ends_in: {
        type: DataTypes.DATEONLY
    }
}, {
    timestamps: false
})

User.hasMany(Plan, { foreignKey: 'user_id' })
Plan.belongsTo(User, { foreignKey: 'user_id' })