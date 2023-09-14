const { DataTypes,Sequelize } = require('sequelize');
const sequelize = require('./database');
const Category = require('./Category');
  
const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey:true,
    //autoIncrement: true,
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
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
  } ,
  availableForPreorder: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
  preorderQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Default preorder quantity to 0
  },
});

Item.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Item;
