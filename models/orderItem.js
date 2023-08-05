const { DataTypes } = require('sequelize');
const sequlize = require('./database');
const Item = require('./Item');
const Order = require('./Order');

const OrderItem = sequlize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    qty: {
        type: DataTypes.INTEGER,
    },

});

module.exports = OrderItem;
