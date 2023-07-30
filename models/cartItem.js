const { DataTypes } = require('sequelize');
const sequlize = require('./database');
const Item = require('./Item');
const Cart = require('./cart');

const CartItem = sequlize.define('CartItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    Count: {
        type: DataTypes.INTEGER,
    },

});

module.exports = CartItem;
