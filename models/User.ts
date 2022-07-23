import {Sequelize, Model, DataTypes} from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');
const User = sequelize.define('User', {
    idUser: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING,
    promo: DataTypes.STRING,
    role: DataTypes.STRING
});
class UserModel extends Model {
    static async createUser() {
        createUser();
    }
}
async function createUser() {
    const john = await User.create({
        name: 'John',
        lastname: 'Doe',
        password: '123456',
        promo: '2018',
        role: 'admin'
    });
    console.log(john);
}
