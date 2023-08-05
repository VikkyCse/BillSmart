const express = require('express');
const router = express.Router();
const cartItemController = require('../controllers/cartItemController');
const isAdmin = require('../middleware/authorization').isAdmin;
const isUser = require('../middleware/authorization').isUser;

// Create a new cart item
router.post('/cartitems', cartItemController.createCartItem);

// Read all cart items
router.get('/cartitems', cartItemController.getAllCartItems);

// Read a specific cart item by ID
router.get('/cartitems/:id', cartItemController.getCartItemById);

// Update a cart item by ID
router.put('/cartitems/:id', cartItemController.updateCartItem);

// Delete a cart item by ID
router.delete('/cartitems/:id', cartItemController.deleteCartItem);

module.exports = router;
