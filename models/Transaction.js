const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const User = require('./User');
const Coupon = require('./Coupon');
const CartItem = require('./Cart_Items');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  Amount: {
    type: DataTypes.DECIMAL,
  },
  Transaction_Time: {
    type: DataTypes.DATE,
  },
  Type: {
    type: DataTypes.INTEGER,
  },
  Is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Transaction.belongsTo(User, { foreignKey: 'user_id' });
Transaction.belongsTo(Coupon, { foreignKey: 'coupon_id' });
Transaction.belongsTo(CartItem, { foreignKey: 'cart_item_id' });

module.exports = Transaction;
