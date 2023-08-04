const Transaction = require('../models/Transaction');

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const { Amount, Transaction_Time, Is_completed, user_id, coupon_id, cart_item_id, Type } = req.body;
    const transaction = await Transaction.create({ Amount, Transaction_Time, Is_completed, user_id, coupon_id, cart_item_id, Type });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: 'Error creating the transaction' });
  }
};

// Read all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};

// Read a specific transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching transaction by ID' });
  }
};

// Update a transaction by ID
const updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { Amount, Transaction_Time, Is_completed, user_id, coupon_id, cart_item_id, Type } = req.body;
    const updatedTransaction = await Transaction.update(
      { Amount, Transaction_Time, Is_completed, user_id, coupon_id, cart_item_id, Type },
      { where: { id: transactionId } }
    );
    res.status(200).json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ error: 'Error updating the transaction' });
  }
};

// Delete a transaction by ID
const deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    await Transaction.destroy({ where: { id: transactionId } });
    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (err) {
    res.status(500).json({ error: 'Error deleting the transaction' });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
