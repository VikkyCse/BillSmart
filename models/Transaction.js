const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('./database');
const User = require('./User');
const Coupon = require('./Coupon');
const Order = require('./order');
const TransactionType = require('./TranscationType'); // Import the TransactionType model

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  Amount: {
    type: DataTypes.DECIMAL,
  },
  Transaction_Time: {
    type: DataTypes.DATE,
  },
  Is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  order_id: {
    type: DataTypes.UUID,
  },
});

Transaction.belongsTo(User, { foreignKey: 'user_id' });
Transaction.belongsTo(Coupon, { foreignKey: 'coupon_id' });
Transaction.belongsTo(TransactionType, { foreignKey: 'transaction_type_id' });

module.exports = Transaction;
