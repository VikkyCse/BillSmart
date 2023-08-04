const Order = require('../models/order');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { totalAmount, customerId } = req.body;
    const order = await Order.create({ totalAmount, customerId });
    res.status(200).json(order);
  } catch (err) {
    res.status(200).json({ error: 'Error creating the order' });
  }
};

// Read all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (err) {
    res.status(200).json({ error: 'Error fetching orders' });
  }
};

// Read a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(200).json({ error: 'Error fetching order by ID' });
  }
};

// Update an order by ID
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { totalAmount, customerId } = req.body;
    const updatedOrder = await Order.update(
      { totalAmount, customerId },
      { where: { id: orderId } }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(200).json({ error: 'Error updating the order' });
  }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    await Order.destroy({ where: { id: orderId } });
    res.status(200).end(); 
  } catch (err) {
    res.status(200).json({ error: 'Error deleting the order' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
