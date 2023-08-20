const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');
// const isAdmin = require('../middleware/authorization').isAdmin;
// const isUser = require('../middleware/authorization').isUser;
// Create a new user
router.post(
    '/create',
    [
      body('name', 'Name is required').notEmpty(),
      body('rfid', 'RFID is required').notEmpty(),
      body('User_name', 'Username is required').notEmpty(),
      body('password', 'Password is required').notEmpty(),
    ],
    userController.createUser
  );


router.get('/login', userController.loginUser);

// Read all users
router.get('/', userController.getAllUsers);

// read a specific user ny rfid
router.get('/:id',userController.getUserByRFId);

// Read a specific user by ID
router.get('/:id', userController.getUserById);

// Update a user by ID
router.put('/:id', userController.updateUser);

// Delete a user by ID
router.delete('/:id', userController.deleteUser);

// Update password by user
router.put(':id/update-password' , userController.updateUserPassword);



module.exports = router;
