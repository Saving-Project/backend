import { DataTypes } from 'sequelize'
import { sequelize } from '../database/database.js'

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'El nombre es requerido'
            },
            is: {
                args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                msg: 'Solo puedes usar letras'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'El correo es obligatorio'
            },
            isEmail: {
                args: true,
                msg: 'Favor ingresar un correo válido'
            },
            isUnique: async (email) => {
                const emailExists = await User.findOne({
                    where: {email}
                })
                if (emailExists) {
                    throw new Error('El correo ya está en uso')
                }
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'La contraseña es obligatoria'
            }
        }
    },
    saving: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    }
}, {
    timestamps: false
})