const { DataTypes,Sequelize } = require('sequelize');
const sequelize = require('./database');
const User = require('./User');
const Coupon = require('./Coupon');
const Order = require('./Order');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    //autoIncrement: true,
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
  order_id: {
    type: DataTypes.UUID,
  }
  
  
});

Transaction.belongsTo(User, { foreignKey: 'user_id' });
Transaction.belongsTo(Coupon, { foreignKey: 'coupon_id' })

 //Order.hasOne(Transaction)
module.exports = Transaction;
