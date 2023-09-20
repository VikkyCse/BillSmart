const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { authenticateToken, authorizeAdmin ,authorizeUser } = require('../middleware/authMiddleware');
// const isAdmin = require('../middleware/authorization').isAdmin;
// const isUser = require('../middleware/authorization').isUser;
// Create a new shop
// router.post('/',shopController.upload, shopController.createShop);
router.post('/create-shop',authenticateToken,authorizeAdmin, shopController.upload, shopController.createShop);

 
// Read all shops
router.get('/',authenticateToken, shopController.getAllShops);
 
// Read a specific shop by ID
router.get('/:id',authenticateToken, shopController.getShopById);
// Define the route for getting categories by user ID
 


// Update a shop by ID
// router.put('/:id', shopController.updateShop);
router.put('/:id',authenticateToken,authorizeAdmin, shopController.upload, shopController.updateShop);

// Delete a shop by ID
router.delete('/:id',authenticateToken,authorizeAdmin, shopController.deleteShop);

module.exports = router;
