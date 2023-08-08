const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Item = require('./Item');
const Order = require('./Order');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    qty: {
        type: DataTypes.INTEGER,
    },
});

// Create associations
OrderItem.belongsTo(Item); // Adds the foreign key "ItemId" to the OrderItem table
OrderItem.belongsTo(Order); // Adds the foreign key "OrderId" to the OrderItem table

module.exports = OrderItem;
