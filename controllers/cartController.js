const Cart = require('../models/Cart');

// Create a new cart
const createCart = async (req, res) => {
  try {
    const { user_id } = req.body;
    const cart = await Cart.create({ user_id });
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error creating the cart' });
  }
};

// Read all carts
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching carts' });
  }
};

// Read a specific cart by ID
const getCartById = async (req, res) => {
  try {
    const cartId = req.params.id;
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cart by ID' });
  }
};

// Update a cart by ID
const updateCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    const { user_id } = req.body;
    const updatedCart = await Cart.update(
      { user_id },
      { where: { id: cartId } }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: 'Error updating the cart' });
  }
};

// Delete a cart by ID
const deleteCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    await Cart.destroy({ where: { id: cartId } });
    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (err) {
    res.status(500).json({ error: 'Error deleting the cart' });
  }
};

module.exports = {
  createCart,
  getAllCarts,
  getCartById,
  updateCart,
  deleteCart,
};
