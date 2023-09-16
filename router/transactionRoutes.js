const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken, authorizeAdmin ,authorizeUser } = require('../middleware/authMiddleware');

// Create a new transaction
router.post('/',authenticateToken, transactionController.createTransaction);
router.post('/createTransactionByAdmin',authenticateToken,authorizeAdmin, transactionController.createTransactionByAdmin);
router.post('/createTransactionByUser',authenticateToken, transactionController.createTransactionByUser);
router.get('/orders/:orderId',authenticateToken, transactionController.getOrderItemsByOrderId);
router.post('/checkQuantity',authenticateToken, transactionController.checkQuantity);

// Read all transactions
router.get('/',authenticateToken, transactionController.getAllTransactions);

// Read a specific transaction by ID
// router.get('/:id', transactionController.getTransactionById);
router.get('/:id',authenticateToken, transactionController.getAllTransactionsbyUser);

// Update a transaction by ID
router.put('/:id',authenticateToken, transactionController.updateTransaction);

// Delete a transaction by ID
router.delete('/:id',authenticateToken, transactionController.deleteTransaction);

//refund a transaction
router.post('/refund',authenticateToken, transactionController.refund);

module.exports = router;
