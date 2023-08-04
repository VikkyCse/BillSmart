const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

// Create a new shop
router.post('/shops', shopController.createShop);

// Read all shops
router.get('/shops', shopController.getAllShops);

// Read a specific shop by ID
router.get('/shops/:id', shopController.getShopById);

// Update a shop by ID
router.put('/shops/:id', shopController.updateShop);

// Delete a shop by ID
router.delete('/shops/:id', shopController.deleteShop);

module.exports = router;
