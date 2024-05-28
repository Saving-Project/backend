import { User } from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export const register = async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body
    try {
        if (password.length < 8 || password.length > 20) {
            return res.status(400).json({
                error: {
                    message: 'La contraseña debe tener entre 8 y 20 caracteres'
                }
            })
        }
        
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: {
                    message: 'La contraseña debe contener al menos una letra y un número'
                }
            })
        }

        const pwdHash = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name,
            email,
            password: pwdHash
        })
        res.status(200).json(newUser)
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errs = error.errors.map(err => err.message)
            return res.status(400).json({ errors: errs})
        } else {
            return res.status(500).json(error)
        }
    }
}