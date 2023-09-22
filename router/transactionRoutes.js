const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken, authorizeAdmin ,authorizeUser } = require('../middleware/authMiddleware');

// Create a new transaction
router.post('/',authenticateToken, transactionController.createTransaction);
router.post('/createTransactionByAdmin',authenticateToken, transactionController.createTransactionByAdmin);
router.post('/createTransactionByUser',authenticateToken, transactionController.createTransactionByUser);
router.get('/orders/:orderId',authenticateToken, transactionController.getOrderItemsByOrderId);
router.post('/checkQuantity',authenticateToken, transactionController.checkQuantity);


router.post('/createNaturalTransactionByAdmin',authenticateToken, transactionController.createNaturalTransactionByAdmin);

// Read all transactions
router.get('/',authenticateToken, transactionController.getAllTransactions);



// Read a specific transaction by ID
// router.get('/:id', transactionController.getTransactionById);
router.get('/:id',authenticateToken, transactionController.getAllTransactionsbyUser);
router.get('/notcompleted/:id',authenticateToken, transactionController.getIncompleteTransactionsbyUser);

// Update a transaction by ID
router.put('/:id',authenticateToken, transactionController.updateTransaction);

router.put('/complete/:id',authenticateToken, transactionController.Transactioncompletion);

// Delete a transaction by ID
router.delete('/:id',authenticateToken, transactionController.deleteTransaction);

//refund a transaction
router.post('/refund',authenticateToken, transactionController.refund);
router.post('/refundwithQty',authenticateToken, transactionController.refundWithQuantity);
router.post('/refundwithoutQty',authenticateToken, transactionController.refundWithoutQuantity);
// Fetch data by Item ID
router.get('/fetchDataByItemId/:itemId', transactionController.fetchDataByItemId);

// Fetch data by Date
router.get('/fetchDataByDate/:date', transactionController.fetchDataByDate);

// Fetch data within a Date Span
router.get('/fetchDataWithinDateSpan', transactionController.fetchDataWithinDateSpan);

// Fetch data by Item and within a Date Span
router.get('/fetchDataByItemAndDateSpan', transactionController.fetchDataByItemAndDateSpan);

module.exports = router;
