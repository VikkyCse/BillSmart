const { DataTypes, Sequelize } = require('sequelize');
const sequlize = require('./database');

const TransactionType = sequlize.define('TransactionType', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING
    }
})

module.exports = TransactionType;