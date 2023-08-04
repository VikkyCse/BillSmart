const { DataTypes } = require('sequelize');
const sequlize = require('./database');
const User = require('./user');
const TransactionType = require('./TranscationType');
const Coupon = require('./coupon');
const Order = require('./order');

const Transaction = sequlize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User, 
            key: 'id',
        },
    },
    Amount: {
        type: DataTypes.DECIMAL,
    },
    Transaction_Time: {
        type: DataTypes.DATE,
    },
    Type: {
        type: DataTypes.INTEGER,
        references: {
            model: TransactionType,
            key: 'id',
        },
    },
    Is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    coupon_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Coupon,
            key: 'id',
        },
    },
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'id',
        },
    },
});

module.exports = Transaction;
