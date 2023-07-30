const { DataTypes } = require('sequelize');
const sequlize = require('./database');


const Category = sequlize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },

});

module.exports = Category;
