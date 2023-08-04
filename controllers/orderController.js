const Order = require('../models/Order');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { order_id, Quantity, Product_id } = req.body;
    const order = await Order.create({ order_id, Quantity, Product_id });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error creating the order' });
  }
};

// Read all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching orders' });
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
    res.status(500).json({ error: 'Error fetching order by ID' });
  }
};

// Update an order by ID
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { order_id, Quantity, Product_id } = req.body;
    const updatedOrder = await Order.update(
      { order_id, Quantity, Product_id },
      { where: { id: orderId } }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: 'Error updating the order' });
  }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    await Order.destroy({ where: { id: orderId } });
    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (err) {
    res.status(500).json({ error: 'Error deleting the order' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
