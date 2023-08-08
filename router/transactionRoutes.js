const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
// const isAdmin = require('../middleware/authorization').isAdmin;
// const isUser = require('../middleware/authorization').isUser;
// Create a new transaction
router.post('/transactions', transactionController.createTransaction);

// Read all transactions
router.get('/transactions', transactionController.getAllTransactions);

// Read a specific transaction by ID
router.get('/transactions/:id', transactionController.getTransactionById);

// Update a transaction by ID
router.put('/transactions/:id', transactionController.updateTransaction);

// Delete a transaction by ID
router.delete('/transactions/:id', transactionController.deleteTransaction);

module.exports = router;
