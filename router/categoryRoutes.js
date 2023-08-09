const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
// const isAdmin = require('../middleware/authorization').isAdmin;
// const isUser = require('../middleware/authorization').isUser;
// Create a new category
router.post('/', categoryController.createCategory);

// Read all categories
router.get('/', categoryController.getAllCategories);

// Read a specific category by ID
router.get('/:id', categoryController.getCategoryById);

// Update a category by ID
router.put('/:id', categoryController.updateCategory);

// Delete a category by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
