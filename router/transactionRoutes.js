const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
// const isAdmin = require('../middleware/authorization').isAdmin;
// const isUser = require('../middleware/authorization').isUser;
// Create a new transaction
router.post('/', transactionController.createTransaction);
router.post('/createTransactionByAdmin', transactionController.createTransactionByAdmin);
router.post('/createTransactionByUser', transactionController.createTransactionByUser);
router.get('/orders/:orderId', transactionController.getOrderItemsByOrderId);
router.post('/checkQuantity', transactionController.checkQuantity);

// Read all transactions
router.get('/', transactionController.getAllTransactions);

// Read a specific transaction by ID
// router.get('/:id', transactionController.getTransactionById);
router.get('/:id', transactionController.getAllTransactionsbyUser);

// Update a transaction by ID
router.put('/:id', transactionController.updateTransaction);

// Delete a transaction by ID
router.delete('/:id', transactionController.deleteTransaction);

//refund a transaction
router.post('/refund', transactionController.refund);

module.exports = router;
