const { DataTypes } = require('sequelize')
const sequlize = require('./database')
const { checkpass, hashed } = require('../hashPassword')
const User = sequlize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    User_name: {
        type: DataTypes.STRING,
        unique: true,
    },
    rfid: {
        type: DataTypes.STRING,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    amount: {
        type: DataTypes.FLOAT,
    },
    usertype: {
        type: DataTypes.INTEGER(1),
    },
    gender: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isHosteller: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    rollNo: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(pass) {
            this.setDataValue('password', hashed(pass));
        }


    },
});

module.exports = User;