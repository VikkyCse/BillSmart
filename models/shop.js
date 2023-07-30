const { Sequelize, DataTypes } = require('sequelize');
const sequlize = require('./database');

const Shop = sequlize.define('Shop', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.BLOB,
        allowNull: true,
    },
});

module.exports = Shop;
