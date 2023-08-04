const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

// Register a new user
router.post(
  '/register',
  [
    body('username', 'Username is required').notEmpty(),
    body('password', 'Password is required').notEmpty(),
  ],
  authController.registerUser
);

// Login user
router.post(
  '/login',
  [
    body('username', 'Username is required').notEmpty(),
    body('password', 'Password is required').notEmpty(),
  ],
  authController.loginUser
);

module.exports = router;
