const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAdmin = require('../middleware/authorization').isAdmin;
const isUser = require('../middleware/authorization').isUser;
// Create a new user
router.post('/users', userController.createUser);

// Read all users
router.get('/users', userController.getAllUsers);

// Read a specific user by ID
router.get('/users/:id', userController.getUserById);

// Update a user by ID
router.put('/users/:id', userController.updateUser);

// Delete a user by ID
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
