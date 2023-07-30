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
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Transaction,
            key: 'id',
        },
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
});

module.exports = Order;
