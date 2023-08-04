const express = require('express');
const itemRoutes = express.Router()
const itemcontroller = require('../controller/itemcontroller')


itemRoutes.post('/create', itemcontroller.createItem);
itemRoutes.patch('/update', itemcontroller.updateitem)
itemRoutes.delete('/delete', itemcontroller.deleteitem)

  


module.exports = itemRoutes