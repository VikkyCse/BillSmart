const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Shop = require('./shop');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
Category.belongsTo(Shop,{ foreignKey: 'Shop_id' })
module.exports = Category;
