import jwt from 'jsonwebtoken'
import { data } from '../config.js'

const pwdToken = data.jwtToken

export const authRequired = (req, res, next) => {
    const token = req.headers.authorization

    if (!token) return res.status(401).json({
        message: 'No token, authorization denied'
    })

    jwt.verify(token, pwdToken, (error, user) => {
        if (error) return res.status(403).json({ message: 'Invalid token' })
        req.user = user
        next()
    })
}