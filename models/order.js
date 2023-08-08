const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Transaction = require('./Transaction');
const Item = require('./Item');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

Order.hasMany(Transaction, { foreignKey: 'orderId' });
Order.hasMany(Item, { foreignKey: 'orderId' });
module.exports = Order;
