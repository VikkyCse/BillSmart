const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const isAdmin = require('../middleware/authorization').isAdmin;
const isUser = require('../middleware/authorization').isUser;
// Create a new item
router.post('/items', itemController.createItem);

// Read all items
router.get('/items', itemController.getAllItems);

// Read a specific item by ID
router.get('/items/:id', itemController.getItemById);

// Update an item by ID
router.put('/items/:id', itemController.updateItem);

// Delete an item by ID
router.delete('/items/:id', itemController.deleteItem);

module.exports = router;
