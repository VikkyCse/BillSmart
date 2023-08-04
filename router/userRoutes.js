const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');
const isAdmin = require('../middleware/authorization').isAdmin;
const isUser = require('../middleware/authorization').isUser;
// Create a new user
router.post(
    'users/create',
    [
      body('name', 'Name is required').notEmpty(),
      body('rfid', 'RFID is required').notEmpty(),
      body('User_name', 'Username is required').notEmpty(),
      body('password', 'Password is required').notEmpty(),
    ],
    userController.createUser
  );

router.post(
    '/register',
    [
      body('name', 'Name is required').notEmpty(),
      body('rfid', 'RFID is required').notEmpty(),
      body('User_name', 'Username is required').notEmpty(),
      body('password', 'Password is required').notEmpty(),
    ],
    userController.registerUser
  );

router.get('/login', userController.loginUser);

// Read all users
router.get('/users', userController.getAllUsers);

// Read a specific user by ID
router.get('/users/:id', userController.getUserById);

// Update a user by ID
router.put('/users/:id', userController.updateUser);

// Delete a user by ID
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
