const { DataTypes } = require('sequelize');
const sequlize = require('./database');
const Category = require('./category');

const Item = sequlize.define('Item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
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
    },
});

module.exports = Item;
