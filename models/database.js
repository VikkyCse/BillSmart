const Sequlize = require('sequelize')



const sequelize = new Sequlize("billsmart", "root", "sowrajr!o", {
    dialect: "mysql",
    logging: false
})
module.exports = sequelize