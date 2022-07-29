import {Model, DataTypes} from 'sequelize';

const Sequelize = require('sequelize');
const db = require('../utils/mysql.connector');

export const Presence = db.define('Presence', {
    idPresence: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idUser: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    dayPresence: {
        type: Sequelize.DATE,
        allowNull: false
    },
    validatePresence: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
});
module.exports = Presence;

