const { DataTypes,Sequelize } = require('sequelize');
const sequelize = require('./database');
const User = require('./User');
const Coupon = require('./coupon');
const Order = require('./order');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
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
// Transaction.belongsTo(Order);
// Order.hasOne(Transaction)
module.exports = Transaction;
