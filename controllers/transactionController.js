const Transaction = require('../models/Transaction');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const User = require('../models/User');
const Cart = require('../models/Cart');
const CartItem = require('../models/Cart_Items');

const { Op } = require('sequelize');
const Item = require('../models/Item');
const sequelize = require('../models/database');
const currentDate = new Date();

const createTransaction = async (req, res) => {
  const {
    Amount,
    Transaction_Time,
    user_id,
    coupon_id,
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
        Is_completed : 0,
        user_id,
        coupon_id,
        order_id: newOrder.id,
        Type : 3,
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
        Transaction_Time ,
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

const checkQuantity = async (req, res) => {
  try { 
    const { cartItems } = req.body;

    // const availableItems = [];
    const insufficientItems = [];

    for (const cartItem of cartItems) {
      const { itemId, quantity } = cartItem;
      const item = await Item.findByPk(itemId);
 

      if (!item) {
        insufficientItems.push({ itemId, name: 'Item not found', availableQuantity: 0, quantity });
      } else if (item.quantity < quantity) {
        insufficientItems.push({ itemId, name: item.name, availableQuantity: item.quantity, quantity });
      } 
      // else {
      //   availableItems.push({ itemId, name: item.name, availableQuantity: item.quantity, quantity });
      // }
    }

    res.status(200).json({ insufficientItems });
  } catch (error) {
    console.error('Error checking item availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

}





const createTransactionByUser = async (req, res) => {
  const {
    Amount,
    user_id,
    coupon_id,
    cartItems //collection
  } = req.body;

  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(200).json({ error: 'User not found' });
    }

    const insufficientItems = [];

    await sequelize.transaction(async (t) => {
      // Calculate the total quantity and price for the items being ordered
      let totalQuantity = 0;
      let totalPrice = 0;

      for (const item of cartItems) {
        const { itemId, quantity , cost} = item;

        // Check if the item exists and if its available quantity is sufficient
        const availableItem = await Item.findByPk(itemId);
        if (!availableItem || availableItem.quantity < quantity) {
          // If insufficient quantity, add details to the insufficientItems array
          insufficientItems.push({
            itemId,
            name: availableItem ? availableItem.name : 'Item not found',
            available_quantity: availableItem ? availableItem.quantity : 0,
            ordered_quantity: quantity,
          });
        } else {
          totalQuantity += quantity;
          totalPrice += availableItem.price * quantity;

          // Deduct the ordered quantity from the available item quantity
          availableItem.quantity -= quantity;
          await availableItem.save({ transaction: t });
        }
      }

      if (insufficientItems.length > 0) {
        // Respond with details of insufficient quantity items
        return res.status(200).json({
          error: 'Insufficient quantity for one or more items',
          insufficientItems,
        });
      }

      console.log(totalPrice)
      if (Amount != totalPrice) {
        return res.status(200).json({ error: 'Try Again' });
      }

      if (user.amount < totalPrice) {
        return res.status(200).json({ error: 'Insufficient balance' });
      }

      // Deduct the total price from the user's balance
      user.amount -= totalPrice;
      await user.save({ transaction: t });

      // Create a new order
      const newOrder = await Order.create({ transaction: t });

      // Create order items associated with the new order
      const orderItems = cartItems.map(item => ({
        Item_id: item.itemId,
        Quantity: item.quantity,
        orderId: newOrder.id,
        cost : item.cost
      }));

      await OrderItem.bulkCreate(orderItems, { transaction: t });

      // Create a new transaction record
      const transaction = await Transaction.create({
        Amount: totalPrice,
        Transaction_Time : currentDate,
        Is_completed:false,
        user_id,
        coupon_id,
        order_id: newOrder.id,
        transactiontype:3
      }, { transaction: t });

      res.status(201).json(transaction.id);
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({ error: 'Error creating the transaction'  });
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

const getAllTransactionsbyUser = async (req, res) => {
  try {
    const userid = req.params.id;
    const transactions = await Transaction.findAll({ where: { user_id: userid } });
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

const getOrderItemsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params; // Assuming you pass orderId as a parameter
    // console.log(orderId)
    // Find all order items with the specified orderId
    const orderItems = await OrderItem.findAll({
      where: { orderId:orderId },
    });

    // Check if any order items were found
    if (orderItems.length == 0) {
      return res.status(200).json({ message: 'No order items found for the specified order.' });
    }

    // Return the found order items
    res.status(200).json(orderItems);
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  refund,
  createTransactionByAdmin,
  createTransactionByUser,
  checkQuantity,
  getAllTransactionsbyUser,
  getOrderItemsByOrderId
};
