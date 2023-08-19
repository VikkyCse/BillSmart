const { DataTypes,Sequelize } = require('sequelize');
const sequelize = require('./database');
const Category = require('./Category');

const Shop = sequelize.define('Shop', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
   // autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isSpecial: { 
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
});

Shop.hasMany(Category, { onDelete: 'CASCADE' });

module.exports = Shop;
