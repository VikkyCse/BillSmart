const Sequlize = require('sequelize')



const sequelize = new Sequlize("billsmart", "root", "Sece@2021", {
    dialect: "mysql",
    logging: false,
})
module.exports = sequelize