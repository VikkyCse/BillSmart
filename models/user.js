const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  User_name: {
    type: DataTypes.STRING,
    unique: true,
  },
  rfid: {
    type: DataTypes.STRING,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.FLOAT,
  },
  usertype: {
    type: DataTypes.INTEGER(1),
    allowNull: false,
    defaultValue: 0,
  },
  gender: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isHosteller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  natural_amt: {
    type: DataTypes.FLOAT,
  },
  rollNo: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
