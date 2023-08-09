const Sequlize = require('sequelize')



const sequelize = new Sequlize("billsmart", "root", "12345", {
    dialect: "mysql",
    logging: false
})
module.exports = sequelize