const { DataTypes } = require('sequelize');
const sequlize = require('./database');
const Item = require('./Item');
const Order = require('./order');

const OrderItem = sequlize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Item,
            key: 'id',
        },
    },
    qty: {
        type: DataTypes.INTEGER,
    },
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'id',
        },
    },
});

module.exports = OrderItem;
