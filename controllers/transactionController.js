const Transaction = require('../models/Transaction');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const User = require('../models/User');
const Cart = require('../models/Cart');
const CartItem = require('../models/Cart_Items');

const { Op } = require('sequelize');

const createTransaction = async (req, res) => {
  const {
    Amount,
    Transaction_Time,
    Is_completed,
    user_id,
    coupon_id,
    Type
  } = req.body;

  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    if (user.Amount < Amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    await sequelize.transaction(async (t) => {
      user.Amount -= Amount;
      await user.save({ transaction: t });

      const newOrder = await Order.create({ transaction: t });
      const cart = await Cart.findOne({ where: { user_id: user.id } });

      const transaction = await Transaction.create({
        Amount,
        Transaction_Time,
        Is_completed,
        user_id,
        coupon_id,
        order_id: newOrder.id,
        Type
      }, { transaction: t });

      const cartItems = await CartItem.findAll({ where: { Cart_id: cart.id } });

      const orderItems = cartItems.map(cartItem => ({
        Item_id: cartItem.Item_id,
        Count: cartItem.Count,
        orderId: newOrder.id
      }));

      await OrderItem.bulkCreate(orderItems, { transaction: t });

      await CartItem.destroy({ where: { Cart_id: cart.id }, transaction: t });
      await Cart.destroy({ where: { user_id }, transaction: t });

      res.status(201).json(transaction);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating the transaction' });
  }
};


const createTransactionByAdmin = async (req, res) => {
  const {
    Amount,
    Transaction_Time,
    Is_completed,
    user_id,
    coupon_id,
    Type,
    items // An array of objects containing item_id and quantity
  } = req.body;

  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    if (user.Amount < Amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    await sequelize.transaction(async (t) => {
      user.Amount -= Amount;
      await user.save({ transaction: t });

      const newOrder = await Order.create({ transaction: t });

      const orderItems = items.map(item => ({
        Item_id: item.item_id,
        Count: item.quantity,
        orderId: newOrder.id
      }));

      await OrderItem.bulkCreate(orderItems, { transaction: t });

      const transaction = await Transaction.create({
        Amount,
        Transaction_Time,
        Is_completed,
        user_id,
        coupon_id,
        order_id: newOrder.id,
        Type
      }, { transaction: t });

      res.status(201).json(transaction);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating the transaction' });
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
  const transactionId = req.params.id;

  try {
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

  try {
    await Transaction.update(
      { Amount, Transaction_Time, Is_completed, user_id, coupon_id, cart_item_id, Type },
      { where: { id: transactionId } }
    );
    res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating the transaction' });
  }
};

const deleteTransaction = async (req, res) => {
  const transactionId = req.params.id;

  try {
    await Transaction.destroy({ where: { id: transactionId } });
    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the transaction' });
  }
};
const refund = async (req, res) => {
  const { transactionId, itemId } = req.body;

  try {
    await sequelize.transaction(async (t) => {
      const transaction = await Transaction.findByPk(transactionId, { transaction: t });

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      if (itemId) {
        const orderItem = await OrderItem.findOne({
          where: { orderId: transaction.order_id, Item_id: itemId },
          transaction: t,
        });

        if (!orderItem) {
          return res.status(404).json({ error: 'Item not found in the transaction' });
        }

        const item = await Item.findByPk(itemId, { transaction: t });

        if (!item) {
          return res.status(404).json({ error: 'Item not found' });
        }

        // Refund the item
        const refundedAmount = orderItem.Count * item.price;
        const user = await User.findByPk(transaction.user_id, { transaction: t });
        user.Amount += refundedAmount;
        await user.save({ transaction: t });

        // Update item quantity
        item.quantity += orderItem.Count;
        await item.save({ transaction: t });

        // Remove the order item
        await orderItem.destroy({ transaction: t });

        return res.status(200).json({ message: 'Item refunded successfully' });
      } else {
        // Refund the entire transaction
        const user = await User.findByPk(transaction.user_id, { transaction: t });
        user.Amount += transaction.Amount;
        await user.save({ transaction: t });

        const orderItems = await OrderItem.findAll({
          where: { orderId: transaction.order_id },
          transaction: t,
        });

        // Update item quantities and remove order items
        for (const orderItem of orderItems) {
          const item = await Item.findByPk(orderItem.Item_id, { transaction: t });
          if (item) {
            item.quantity += orderItem.Count;
            await item.save({ transaction: t });
          }
          await orderItem.destroy({ transaction: t });
        }

        // Delete the transaction
        await transaction.destroy({ transaction: t });

        return res.status(200).json({ message: 'Transaction refunded successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing refund' });
  }
};



module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  refund,
  createTransactionByAdmin
};
