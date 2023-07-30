const { DataTypes } = require('sequelize');
const sequlize = require('./database');
const User = require('./user');

const Naturals = sequlize.define('Naturals', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    time: {
        type: DataTypes.DATE,
    },
    amt: {
        type: DataTypes.DECIMAL,
    },
});

module.exports = Naturals;
