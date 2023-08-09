const Sequlize = require('sequelize')
require('dotenv').config();


const sequelize = new Sequlize("billsmart", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: "mysql",
    logging: false
})
module.exports = sequelize