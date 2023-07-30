const { DataTypes } = require('sequelize');
const sequlize = require('./database');
const Transaction = require('./Transaction');
const User = require('./user');

const Order = sequlize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

});

module.exports = Order;
