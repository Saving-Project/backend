import app from './app.js'
import { sequelize } from './database/database.js'
import { data } from './config.js'

const port = data.port

const main = async () => {
    try {
        await sequelize.sync({ alter: true })
        app.listen(port)
        console.log(`Server is running on http://localhost:${port}`)
    } catch (error) {
        console.log(`Unable to connect to the database: ${error}`)
    }
}

main()