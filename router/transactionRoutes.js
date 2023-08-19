const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
// const isAdmin = require('../middleware/authorization').isAdmin;
// const isUser = require('../middleware/authorization').isUser;
// Create a new transaction
router.post('/', transactionController.createTransaction);

// Read all transactions
router.get('/', transactionController.getAllTransactions);

// Read a specific transaction by ID
router.get('/:id', transactionController.getTransactionById);

// Update a transaction by ID
router.put('/:id', transactionController.updateTransaction);

// Delete a transaction by ID
router.delete('/:id', transactionController.deleteTransaction);

//refund a transaction
router.post('/refund', refundController.refund);

module.exports = router;
