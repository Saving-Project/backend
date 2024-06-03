import { DataTypes } from 'sequelize'
import { sequelize } from '../database/database.js'

export const SavingDay = sequelize.define('saving_days', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    day: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
})