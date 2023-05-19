import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';
import { User } from './user';

export const Ticket = sequelize.define('ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
    },
    evidencia: {
        type: DataTypes.BLOB,
    },
    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    prioridad: {
        type: DataTypes.STRING,
        allowNull: true
    },
    idUserAsignado: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, )
