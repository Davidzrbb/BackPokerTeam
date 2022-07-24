import {Model, DataTypes} from 'sequelize';
const Sequelize = require('sequelize');
const db = require('../utils/mysql.connector');

export const User = db.define('User', {
    idUser: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    lastname: Sequelize.STRING,
    login: Sequelize.STRING,
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    promo: Sequelize.STRING,
    role: Sequelize.STRING
});
module.exports = User;

