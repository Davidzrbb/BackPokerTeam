import {Model, DataTypes} from 'sequelize';
const Sequelize = require('sequelize');
const db = require('../utils/mysql.connector');

export const Session = db.define('Session', {
    idSession: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idUser: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expiration: {
        type: Sequelize.DATE,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
});
module.exports = Session;