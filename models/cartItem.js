const { DataTypes } = require('sequelize');
const sequlize = require('../path/to/your/sequelize_instance');
const Item = require('./Item');
const Cart = require('./cart');

const CartItem = sequlize.define('CartItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Item_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Item,
            key: 'id',
        },
    },
    Count: {
        type: DataTypes.INTEGER,
    },
    Cart_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Cart,
            key: 'id',
        },
    },
});

module.exports = CartItem;
