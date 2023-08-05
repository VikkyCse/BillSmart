const { DataTypes } = require('sequelize');
const sequlize = require('./database');
const User = require('./User');

const Cart = sequlize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
});

module.exports = Cart;
