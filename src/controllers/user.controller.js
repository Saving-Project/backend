import { createAccessToken } from '../libs/jwt.js'
import { User } from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { UserSaving } from '../models/user_saving.model.js'

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

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ where: { email } })
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
        
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' })
        
        const token = await createAccessToken(user)
        res.setHeader('Authorization', token)
        return res.status(200).json({user, token})
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getInfo = async (req, res) => {
    const { id } = req.user

    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        })
        if (!user) return res.status(404).json({ message: 'El usuario no existe' })
        
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getSavings = async (req, res) => {
    const userId = req.user.id

    try {
        const userSavings = await UserSaving.findAll({
            where: { user_id: userId}
        })

        if (!userSavings.length) return res.status(404).json({ message: 'No se encontraron planes de ahorro' })
        
        res.status(200).json(userSavings)
    } catch (error) {
        return res.status(500).json(error)
    }
}