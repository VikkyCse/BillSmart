const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
// const isAdmin = require('../middleware/authorization').isAdmin;
// const isUser = require('../middleware/authorization').isUser;
// Create a new order
router.post('/orders', orderController.createOrder);

// Read all orders
router.get('/orders', orderController.getAllOrders);

// Read a specific order by ID
router.get('/orders/:id', orderController.getOrderById);

// Update an order by ID
router.put('/orders/:id', orderController.updateOrder);

// Delete an order by ID
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;
