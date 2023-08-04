const CartItem = require('../models/Cart_Items');

// Create a new cart item
const createCartItem = async (req, res) => {
  try {
    const { Item_id, Count, Cart_id } = req.body;
    const cartItem = await CartItem.create({ Item_id, Count, Cart_id });
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: 'Error creating the cart item' });
  }
};

// Read all cart items
const getAllCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll();
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cart items' });
  }
};

// Read a specific cart item by ID
const getCartItemById = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cart item by ID' });
  }
};

// Update a cart item by ID
const updateCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const { Item_id, Count, Cart_id } = req.body;
    const updatedCartItem = await CartItem.update(
      { Item_id, Count, Cart_id },
      { where: { id: cartItemId } }
    );
    res.status(200).json(updatedCartItem);
  } catch (err) {
    res.status(500).json({ error: 'Error updating the cart item' });
  }
};

// Delete a cart item by ID
const deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    await CartItem.destroy({ where: { id: cartItemId } });
    res.status(204).end(); // 204 No Content - Successfully deleted
  } catch (err) {
    res.status(500).json({ error: 'Error deleting the cart item' });
  }
};

module.exports = {
  createCartItem,
  getAllCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
};
