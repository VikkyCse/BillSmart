const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Item = require('./items');
const Cart = require('./Cart');

const CartItem = sequelize.define('Cart_Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Count: {
    type: DataTypes.INTEGER,
  },
});

CartItem.belongsTo(Item, { foreignKey: 'Item_id' });
CartItem.belongsTo(Cart, { foreignKey: 'Cart_id' });

module.exports = CartItem;
