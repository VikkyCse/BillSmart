const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
// const isAdmin = require('../middleware/authorization').isAdmin;
// const isUser = require('../middleware/authorization').isUser;
// Create a new item
router.post('/create', itemController.imgupload,itemController.createItem);
// router.post('/create-shop', shopController.upload, shopController.createShop);


// Read all
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getAllItemsWithCategory);
// Read a specific item by ID
router.get('/byid/:id', itemController.getItemById);

// Update an item by ID
// router.put('/:id', itemController.updateItem);
router.put('/:id', itemController.imgupload, itemController.updateItem);
    
// Delete an item by ID
router.delete('/:id', itemController.deleteItem);

module.exports = router;
