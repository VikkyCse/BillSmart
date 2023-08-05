const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const isAdmin = require('../middleware/authorization').isAdmin;
const isUser = require('../middleware/authorization').isUser;

// Create a new cart
router.post('/carts', cartController.createCart);

// Read all carts
router.get('/carts', cartController.getAllCarts);

// Read a specific cart by ID
router.get('/carts/:id', cartController.getCartById);

// Update a cart by ID
router.put('/carts/:id', cartController.updateCart);

// Delete a cart by ID
router.delete('/carts/:id', cartController.deleteCart);

module.exports = router;
