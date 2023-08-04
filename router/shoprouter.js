const express = require('express');
const shopRoutes = express.Router();
const {
    createShop,
    getAllShops,
    updateShop,
    deleteShop
} = require('../controller/shopcontroller'); 

shopRoutes.post('/', createShop);
shopRoutes.get('/', getAllShops);
shopRoutes.put('/:id', updateShop);
shopRoutes.delete('/:id', deleteShop);

module.exports = shopRoutes;
