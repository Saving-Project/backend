import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import userRoutes from './routes/user.routes.js'
import savingRoutes from './routes/saving.routes.js'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())

app.use('/api', userRoutes)
app.use('/api', savingRoutes)

export default app