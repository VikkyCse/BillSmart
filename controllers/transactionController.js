const Transaction = require('../models/Transaction');
const order = require('../models/Order');
const orderItem = require('../models/OrderItem');
const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const CartItem = require('../models/Cart_Items');
// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const { Amount, Transaction_Time, Is_completed, user_id, coupon_id, Type } = req.body;
    const user = await User.findByPk(user_id); // Use findByPk instead of find to get a single user by primary key
    const order = await Order.create();
    const cart = await Cart.findOne({ where: { userId: user.id } }); // Use findOne instead of find to get a single cart
    const cartItems = await CartItem.findAll({ where: { cartId: cart.id } }); // Use findAll to get all cart items

    // Create an array to hold the promises for creating OrderItems
    const orderItemPromises = [];

    // Loop through each cart item and create the corresponding OrderItem
    for (const cartItem of cartItems) {
      const { Item_id, Count } = cartItem;
      // Create OrderItem with the corresponding values and orderId as foreign key
      orderItemPromises.push(OrderItem.create({ Item_id, Count, orderId: order.id }));
    }

    // Execute all the OrderItem create promises in parallel
    await Promise.all(orderItemPromises);

    // Create the Transaction record with the orderId from the newly created order
    const transaction = await Transaction.create({
      Amount,
      Transaction_Time,
      Is_completed,
      user_id,
      coupon_id,
      order_id: order.id, // Set the orderId to the id of the newly created order
      Type,
    });

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
