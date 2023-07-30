const sequlize = require('./models/database')

const express = require('express')


app = express()

app.listen(8000, async (req, res) => {
    console.log("server http://localhost:8000");
    await sequlize.sync({ alter: true });
    console.log("db sync")
})