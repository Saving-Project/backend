import { Sequelize } from 'sequelize'
import { data } from '../config.js'

const db = data.db

export const sequelize = new Sequelize(db.database, db.user, db.password, {
    host: db.host,
    dialect: 'postgres'
})