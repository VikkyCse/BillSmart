const { DataTypes } = require('sequelize');
const sequlize = require('./database');
const User = require('./user');

const Cart = sequlize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
});

module.exports = Cart;
