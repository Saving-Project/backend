import jwt from 'jsonwebtoken'
import { data } from '../config.js'

const pwdToken = data.jwtToken

export const createAccessToken = user => {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        saving: user.saving
    }

    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            pwdToken,
            {
                expiresIn: '1d'
            }, (error, token) => {
                if (error) {
                    reject(error)
                }
                resolve(token)
            }
        )
    })
}