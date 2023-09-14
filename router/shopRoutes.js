const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
// const isAdmin = require('../middleware/authorization').isAdmin;
// const isUser = require('../middleware/authorization').isUser;
// Create a new shop
// router.post('/',shopController.upload, shopController.createShop);
router.post('/create-shop', shopController.upload, shopController.createShop);

 
// Read all shops
router.get('/', shopController.getAllShops);
 
// Read a specific shop by ID
router.get('/:id', shopController.getShopById);
// Define the route for getting categories by user ID
 


// Update a shop by ID
// router.put('/:id', shopController.updateShop);
router.put('/:id', shopController.upload, shopController.updateShop);

// Delete a shop by ID
router.delete('/:id', shopController.deleteShop);

module.exports = router;
