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
  Quantity: {
    type: DataTypes.INTEGER,
  },
});

Order.belongsTo(Transaction, { foreignKey: 'order_id' });
Order.belongsTo(Item, { foreignKey: 'Product_id' });

module.exports = Order;
