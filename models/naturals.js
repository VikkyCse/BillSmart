const { DataTypes } = require('sequelize');
const sequlize = require('./database');
const User = require('./user');

const Naturals = sequlize.define('Naturals', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    time: {
        type: DataTypes.DATE,
    },
    amt: {
        type: DataTypes.DECIMAL,
    },
});

module.exports = Naturals;
