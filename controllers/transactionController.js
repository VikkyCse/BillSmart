const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const OrderItem = require('../models/orderItem'); // Adjust the import accordingly
const User = require('../models/User');
const Cart = require('../models/Cart');
const CartItem = require('../models/Cart_Items');

const createTransaction = async (req, res) => {
  try {
    const {
      Amount,
      Transaction_Time,
      Is_completed,
      user_id,
      coupon_id,
      Type
    } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    if (user.Amount < Amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    user.Amount -= Amount;
    await user.save();

    const newOrder = await Order.create();
    const cart = await Cart.findOne({ where: { user_id: user.id } });

    const transaction = await Transaction.create({
      Amount,
      Transaction_Time,
      Is_completed,
      user_id,
      coupon_id,
      order_id: newOrder.id,
      Type
    });

    const cartItems = await CartItem.findAll({ where: { Cart_id: cart.id } });

    const orderItems = cartItems.map(cartItem => ({
      Item_id: cartItem.Item_id,
      Count: cartItem.Count,
      orderId: newOrder.id
    }));

    await OrderItem.bulkCreate(orderItems);

    await CartItem.destroy({ where: { Cart_id: cart.id } });
    await Cart.destroy({ where: { user_id } });



    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating the transaction' , error});
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transaction by ID' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const {
      Amount,
      Transaction_Time,
      Is_completed,
      user_id,
      coupon_id,
      cart_item_id,
      Type
    } = req.body;
    const updatedTransaction = await Transaction.update(
      { Amount, Transaction_Time, Is_completed, user_id, coupon_id, cart_item_id, Type },
      { where: { id: transactionId } }
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the transaction' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    await Transaction.destroy({ where: { id: transactionId } });
    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (error) {
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
