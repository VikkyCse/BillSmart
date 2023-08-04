const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const User = require('./User');

const Naturals = sequelize.define('Naturals', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  time: {
    type: DataTypes.DATE,
  },
});

Naturals.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Naturals;
