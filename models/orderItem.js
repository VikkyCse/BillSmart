const { DataTypes,Sequelize } = require('sequelize');
const sequelize = require('./database');
const Item = require('./Item');
const Order = require('./Order');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true, 
       // autoIncrement: true,
    },
    Quantity: {
        type: DataTypes.INTEGER,
    },
});

// Create associations
OrderItem.belongsTo(Item); // Adds the foreign key "ItemId" to the OrderItem table
OrderItem.belongsTo(Order); // Adds the foreign key "OrderId" to the OrderItem table

module.exports = OrderItem;
