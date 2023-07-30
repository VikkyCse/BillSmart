const { DataTypes } = require('sequelize');
const sequlize = require('./database');
const User = require('./user');

const Coupon = sequlize.define('Coupon', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },

    coupon_name: {
        type: DataTypes.STRING,
    },
    Expire_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isoffer: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    amt: {
        type: DataTypes.INTEGER,
    },
});

module.exports = Coupon;
