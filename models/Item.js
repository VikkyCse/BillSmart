const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Category = require('./Category');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  veg: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  image: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  qty:{
    type:DataTypes.INTEGER,
    defaultValue:0
  }
});

Item.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Item;
