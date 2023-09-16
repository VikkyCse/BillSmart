const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeAdmin ,authorizeUser } = require('../middleware/authMiddleware');

// Create a new user (accessible to all)
router.post('/create',authenticateToken, userController.createUser);

// Login (accessible to all)
router.get('/login',authenticateToken, userController.loginUser);

// Read all users (accessible to admins only)
router.get('/',authenticateToken, authorizeAdmin, userController.getAllUsers);
// router.get('/',authenticateToken,userController.getAllUsers);


// Read a specific user by RFID (accessible to all)
router.get('/rfid/:id',authenticateToken, userController.getUserByRFId);

// Read a specific user by username (accessible to all)
router.get('/:user_name',authenticateToken,authorizeAdmin, userController.getUserByUserName);

// Read a specific user by ID (accessible to all)
router.get('/id/:id',authenticateToken,authorizeAdmin, userController.getUserById);

// Update a user by ID (accessible to all)
router.put('/:id',authenticateToken,authorizeAdmin, userController.updateUser);

// Recharge with RFID (accessible to all)
router.put('/',authenticateToken,authorizeAdmin, userController.Recharge);

// Delete a user by ID (accessible to all)
router.delete('/:id',authenticateToken,authorizeAdmin, userController.deleteUser);

// Update password by user (accessible to all)
router.put('/:id/update-password',authenticateToken, userController.updateUserPassword);

module.exports = router;

