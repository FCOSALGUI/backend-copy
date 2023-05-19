import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';
import { User } from './user';
import { Ticket } from './ticket';

export const Historial = sequelize.define('historial', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    idTicket: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Ticket,
            key: 'id'
        }
    }
}, )
