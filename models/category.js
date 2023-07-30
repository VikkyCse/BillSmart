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
    parent_category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Category,
            key: 'id',
        },
    },
});

module.exports = Category;
