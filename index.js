const sequlize = require('./models/database')
const userRoutes = require('./router/userrouter');
const express = require('express')
const itemRoutes = require('./router/itemrouter');
app = express()
app.use(express.json())
app.use('/user', userRoutes);
app.use('/item', itemRoutes);



app.listen(8000, async (req, res) => {
    console.log("server http://localhost:8000");
    await sequlize.sync({ alter : true }); //force - alter
    console.log("db sync")
})