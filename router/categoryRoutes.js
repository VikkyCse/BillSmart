const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
// const isAdmin = require('../middleware/authorization').isAdmin;
// const isUser = require('../middleware/authorization').isUser;
// Create a new category
router.post('/', categoryController.Upload, categoryController.createCategory);
// router.post('/', categoryController.createCategory);

// Read all categories
router.get('/', categoryController.getAllCategories);

// Read a specific category by ID
router.get('/:id', categoryController.getCategoryById);
router.get('/byname/:name', categoryController.getCategoryByName);

// Update a category by ID
// router.put('/:id', categoryController.updateCategory);
router.put('/:id', categoryController.Upload, categoryController.updateCategory);
router.get('/byshop/:id', categoryController.getAllCategoriesByShopId);


// Delete a category by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
