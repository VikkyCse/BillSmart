const { DataTypes,Sequelize } = require('sequelize');
const sequelize = require('./database');
const Shop = require('./shop');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    //autoIncrement: true, 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type:DataTypes.STRING,
    allowNull:true,
  }
});
Category.belongsTo(Shop,{ foreignKey: 'Shop_id' })

module.exports = Category;
